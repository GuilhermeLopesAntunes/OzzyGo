import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Resend} from 'resend'

@Injectable()
export class EmailService{
    private resend: Resend

    constructor(private configService: ConfigService){
        this.resend = new Resend(this.configService.get("RESEND_API_KEY"))
    }

    async sendVerificationEmail(email: string, token: string) {
        const appUrl = this.configService.get("APP_URL")
        const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`

        await this.resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verificação de conta OzzyGo",
            html: `
            <h2>Olá, Seja Bem-vindo ao OzzyGo</h2>
            <p>Clique no link abaixo para verificar a conta. O link expira em 24 horas </p>
            <a href="${verificationUrl}">Clique Aqui</a>
            <p> Se você não criou uma conta, ignore o email.</p>
            `

        })
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const appUrl = this.configService.get("APP_URL")
        const resetUrl = `${appUrl}/api/auth/reset?token=${token}`

        await this.resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Resetar Senha Conta OzzyGo",
            html: `
            <h2>Olá, Seja Bem-vindo ao OzzyGo</h2>
            <p>Clique no link abaixo para alterar a senha da conta. O link expira em 24 horas </p>
            <a href="${resetUrl}">Clique Aqui</a>
            <p> Se você não criou uma conta, ignore o email.</p>
            `

        })

    }
}