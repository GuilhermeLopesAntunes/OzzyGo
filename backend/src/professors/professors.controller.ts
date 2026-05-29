import { Controller, Get, Patch, Body, UseGuards, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/db/schema';
import { PromoteProfessorDto } from './dro/promote-professor.dto';

@ApiTags("Professors")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get('profile')
  @Roles("professor") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retorna o perfil do professor logado" })
  getProfile(@CurrentUser() user: User) {
    return this.professorsService.getProfile(user.id);
  }
  

  @Patch('specialization')
  @Roles("professor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atualiza a matéria que o professor leciona" })
  updateSpecialization(
    @Body('specialization') specialization: string,
    @CurrentUser() user: User
  ) {
    return this.professorsService.updateSpecialization(user.id, specialization);
  }

  @Post('promote')
  @Roles("student") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Eleva uma conta de estudante para professor usando o código secreto" })
  promoteToProfessor(
    @Body() promoteProfessorDto: PromoteProfessorDto, // <-- Agora usamos o DTO aqui
    @CurrentUser() user: User
  ) {
    // E passamos a propriedade .code para o service
    return this.professorsService.promoteToProfessor(promoteProfessorDto.code, user.id);
  }

  @Get()
  @Roles("admin") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista todos os professores" })
  findAll() {
    return this.professorsService.findAll();
  }
}