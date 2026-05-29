import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,

}from "@nestjs/common"
import {JwtService} from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"
import * as crypto from "crypto"
import { UsersService } from "src/users/users.service"
import { EmailService } from "./email.service"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"
import type { Response } from "express"
import type { User } from "src/db/schema"
import { throwError } from "rxjs"

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService
    ) {}

    async register(dto: RegisterDto){
        const existingUser = await this.userService.findByEmail(dto.email)
        if(existingUser) {
            throw new ConflictException("Uma conta com esse email já existe")
        }

        const passwordHash = await bcrypt.hash(dto.password, 12)

        const verificationToken = crypto.randomBytes(32).toString('hex')

        const verificationTokenExpiresAt = new Date(
            Date.now() + 24*60*60*1000 // 24 horas desde agora
        )

        const user = await this.userService.create({
            email: dto.email,
            name: dto.name,
            username: dto.username,
            passwordHash,
            verificationToken,
            verificationTokenExpiresAt
        })

        void this.emailService.sendVerificationEmail(user.email, verificationToken)

        return {
            message: "Registro feito com sucesso. Verifique a caixa de entrada do email para ativar a conta."
        }
    }



    async verifyEmail(token:string, res: Response) {
        const user = await this.userService.findByVerificationToken(token);

        if(!user || !user.verificationToken) {
            throw new BadRequestException("Veriificação de token falhou")
        }

        if(
            user.verificationTokenExpiresAt &&
            user.verificationTokenExpiresAt < new Date()
        ) {
            throw new BadRequestException(
                "Verificação de token expirou. Tente novamente"
            )  
        }
         await this.userService.update(user.id, {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null
         })

         const tokens = await this.generateTokens(user)
         await this.saveRefreshToken(user.id, tokens.refreshToken)
         this.setRefreshTokenCookie(res, tokens.refreshToken)

         return {
            message: "Email verificado com sucesso. Se divirta com o Ozzy!",
            acessToken: tokens.acessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role

            }
         }
    }

    async login(dto: LoginDto, res: Response){
        const user = await this.userService.findByUsername(dto.username)

        if (!user) {
            throw new UnauthorizedException("Apelido ou Senha inválidos")
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash)

        if(!passwordMatch) {
            throw new UnauthorizedException("Apelido ou Senha inválidos")
        }

        if(!user.isVerified) {
            throw new UnauthorizedException("Verifique seu email para entrar no Ozzy")
        }

        const tokens = await this.generateTokens(user)
        await this.saveRefreshToken(user.id, tokens.refreshToken)
        this.setRefreshTokenCookie(res, tokens.refreshToken)

        return {
            acessToken: tokens.acessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role
            }
        }
    }

    async refresh(refreshToken: string, res: Response){
        if(!refreshToken) {
            throw new UnauthorizedException("Não encontramos o refresh token")
        }

        let payload: {sub: string, email:string}
        try{
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get("JWT_REFRESH_SECRET")
            }) 
        } catch {
                throw new UnauthorizedException("Refresh token invalido")
            }

        const user = await this.userService.findById(payload.sub)

        if(!user || !user.refreshTokenHash) {
            throw new UnauthorizedException("Refresh token invalido")
        }

        const tokenMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash)

        if(!tokenMatch) {
            throw new UnauthorizedException("Refresh Token Invalido")
        }

        const tokens = await this.generateTokens(user)

        await this.saveRefreshToken(user.id, tokens.refreshToken)
        this.setRefreshTokenCookie(res,tokens.refreshToken)

        return {
            acessToken: tokens.acessToken
        }
    }

    async logout(userId: string, res: Response){
        await this.userService.update(userId, {refreshTokenHash: null})

        res.clearCookie("refresh_token")
        return {message: "Deslogado com sucesso"}
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findByEmail(email)
        if(!user) {
            return {
                message: "Se existe um email vinculado, enviaremos um link para criar nova senha"
            }
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiresAt = new Date(Date.now() + 60*60*1000) // 1hr

        await this.userService.update(user.id, {
            resetToken,
            resetTokenExpiresAt
        })

        void this.emailService.sendPasswordResetEmail(user.email, resetToken)

        return {
            message: "Se existe um email vinculado, enviaremos um link para criar nova senha"
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.userService.findByResetToken(token)

        if(!user || !user.resetToken) {
            throw new BadRequestException("Reset Token Invalido")
        }

        if(user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
            throw new BadRequestException("Reset token expirado. Faça outra requisição")
        }

        const passwordHash = await bcrypt.hash(newPassword,12)

        await this.userService.update(user.id, {
            passwordHash,
            resetToken: null,
            resetTokenExpiresAt: null
        })

        return {
            message: "Senha resetada com sucesso. Você pode entrar novamente"
        }
    }
    private async generateTokens(user: User){
        const payload = {sub: user.id, email: user.email, role: user.role}

        const acessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get("JWT_ACCESS_SECRET"),
            expiresIn: this.configService.get("JWT_EXPIRES_IN")
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN")
        })
        

        return {
            acessToken,
            refreshToken
        }

    }

    private async saveRefreshToken(userId: string, refreshToken: string) {
        const refreshTokenHash = await bcrypt.hash(refreshToken,10)
        await this.userService.update(userId, {refreshTokenHash})
    }

    
    private setRefreshTokenCookie(res: Response, refreshToken: string) {
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }
}