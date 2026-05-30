import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    Res,
    Req,
    HttpCode,
    HttpStatus

} from "@nestjs/common"

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiCookieAuth
} from "@nestjs/swagger"
import type {Request, Response} from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import  {Public } from 'src/common/decorators/public.decorator'
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import type { User } from "src/db/schema" 
import { ForgotPassword } from "./dto/forgot-password"
import { ResetPasswordDto } from "./dto/reset-password.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService){}

    //POST /api/auth/register
    @Public()
    @Post("register")
    @ApiOperation({summary: "Registrando um novo usuário"})
    async register(@Body() dto:RegisterDto){
        return this.authService.register(dto)
    }

    //GET/api/auth/verify-email?token=...
    @Public()
    @Get("verify-email")
    @ApiOperation({summary: "Verificar endereço de email e auto-login"})
    async verifyEmail(
        @Query("token") token: string,
        @Res({passthrough: true}) res: Response
    ){
        return this.authService.verifyEmail(token, res)
    }

    //GET/api/auth/login
    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Acesso de login + refresh tokens"})
    async login(
        @Body() dto: LoginDto,
        @Res({passthrough: true}) res: Response
    ){
        return this.authService.login(dto, res)
    }

    //POST /api/auth/refresh

    @Public()
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiOperation({summary: "Atualizar token de acesso usando refresh token cookie"})
    async refresh(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response
    ) {
        const cookies = req.cookies as Record<string, string>
        const refreshToken = cookies?.refresh_token
        return this.authService.refresh(refreshToken, res)
    }

    //POST /api/auth/logout
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({summary: "Sair do sistema e invalidar o refresh token "})
    async logout(
        @CurrentUser() user: User,
        @Res({passthrough: true}) res: Response
    ){
        return this.authService.logout(user.id, res)
    }

    // GET /api/auth/me
    @Get("me")
    @ApiBearerAuth()
    @ApiOperation({summary: "Pegar informações usuário autenticado"})
    me(@CurrentUser() user: User){
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            isVerified: user.isVerified
        }
    }

    //POST /api/auth/forgot-password
    @Public()
    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Requisição de Recuperação de senha"})
    async forgotPassword(@Body() dto: ForgotPassword){
        return this.authService.forgotPassword(dto.email)
    }

    //POST /api/auth/reset-password
    @Public()
    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Recuperação de senha"})
    async resetPassword(@Body() dto: ResetPasswordDto){
        return this.authService.resetPassword(dto.token, dto.password)
    }


}