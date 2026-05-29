import { Controller, Get, UseGuards, HttpCode, HttpStatus, Param, Delete, Body, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/db/schema'; // Lembre-se do "import type" para evitar aquele erro!
import { JoinClassroomDto } from './dto/join-classroom.dto';

@ApiTags("Students")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('profile')
  @Roles("student") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retorna o perfil completo do aluno logado (com os dados de usuário)" })
  getProfile(@CurrentUser() user: User) {

    return this.studentsService.getProfile(user.id);
  }

  @Get()
  @Roles("admin", "professor") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista todos os estudantes cadastrados" })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles("admin", "professor") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Busca um estudante específico pelo ID" })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Delete(':id')
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Desativa o perfil de um estudante" })
  deactivate(@Param('id') id: string) {
    return this.studentsService.deactivate(id);
  }

  @Post('join')
  @Roles("student") 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Insere o aluno na turma utilizando o código gerado pelo Admin" })
  joinClassroom(
    @Body() joinClassroomDto: JoinClassroomDto, 
    @CurrentUser() user: User 
  ) {
    return this.studentsService.joinClassroom(user.id, joinClassroomDto.code);
  }
}