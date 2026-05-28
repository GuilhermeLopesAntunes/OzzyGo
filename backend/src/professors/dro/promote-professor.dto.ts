import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromoteProfessorDto {
  @ApiProperty({ 
    example: 'MEU_CODIGO_SECRETO_123', 
    description: 'Código secreto fornecido pela administração para elevar a conta' 
  })
  @IsString({ message: 'O código deve ser um texto.' })
  @IsNotEmpty({ message: 'O código é obrigatório.' })
  code!: string;
}