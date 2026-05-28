import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinClassroomDto {
  @ApiProperty({ example: 'A7X9K2', description: 'Código único da turma' })
  @IsString({ message: 'O código deve ser um texto.' })
  @IsNotEmpty({ message: 'O código da turma é obrigatório.' })
  code!: string;
}