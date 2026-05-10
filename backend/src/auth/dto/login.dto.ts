import {IsEmail, IsString, IsNotEmpty} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"


export class LoginDto {
    @ApiProperty({example: "Seu Apelido"})
    @IsString()
    @IsNotEmpty()
    username!: string

    @ApiProperty({example: "SuaSenha"})
    @IsString()
    @IsNotEmpty()
    password !: string
}