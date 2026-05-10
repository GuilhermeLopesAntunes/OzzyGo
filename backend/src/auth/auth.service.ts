import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
    NotFoundException
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

    private async generateTokens(user: User){
        const payload = {sub: user.id, email: user.email, role: user.role}

        const acessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get("JWT_ACESS_SECRET"),
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