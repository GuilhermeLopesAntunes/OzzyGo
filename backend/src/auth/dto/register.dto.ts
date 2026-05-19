import {IsEmail, IsString, MinLength, IsNotEmpty} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
    @ApiProperty({example: "email@dominio.com"})
    @IsString()
    @IsNotEmpty()
    email!: string

    @ApiProperty({example: "Nome Sobrenome"})
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({example: "Nome Sobrenome"})
    @IsString()
    @IsNotEmpty()
    username!: string

    @ApiProperty({example: "Senha123!"})
    @IsString()
    @IsNotEmpty()
    password!: string
}