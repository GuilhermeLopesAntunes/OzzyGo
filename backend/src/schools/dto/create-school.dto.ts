import {IsNotEmpty, IsString, Length} from 'class-validator'

export class CreateSchoolDto {
    @IsString()
    @IsNotEmpty({message: "O nome da escola é obrigatório"})
    name!: string

    @IsString()
    @IsNotEmpty({message: "O nome da escola é obrigatório"})
    @Length(5,5, {message: "O código deve ter 5 caracteres"})
    code!: string

}


