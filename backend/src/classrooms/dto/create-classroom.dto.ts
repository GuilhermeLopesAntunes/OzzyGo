import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateClassroomDto {

  @IsString({ message: 'O nome deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O nome da turma é obrigatório.' })
  name!: string;

  @IsUUID('all', { message: 'O ID da escola deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da escola é obrigatório.' })
  schoolId!: string;
}
