import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPassword{
    @ApiProperty({example: "nome@dominio.com"})
    @IsEmail()
    email!: string
}