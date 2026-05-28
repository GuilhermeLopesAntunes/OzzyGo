import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags("Classrooms")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @Roles("admin") 
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cria uma nova turma (Apenas Admins)" })
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Post(':id/professors/:professorId')
  @Roles("admin") // Apenas admins alocam professores
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Vincula um professor a uma turma (Apenas Admins)" })
  assignProfessor(
    @Param('id') id: string, 
    @Param('professorId') professorId: string
  ) {
    return this.classroomsService.assignProfessor(id, professorId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista todas as turmas ativas" })
  findAll() {
    return this.classroomsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Busca os detalhes de uma turma pelo ID" })
  findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(id);
  }

  @Patch(':id')
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atualiza os dados de uma turma (Apenas Admins)" })
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    // return this.classroomsService.update(id, updateClassroomDto);
    return "Em construção";
  }

  @Delete(':id')
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove uma turma (Apenas Admins)" })
  remove(@Param('id') id: string) {
    // return this.classroomsService.remove(id);
    return "Em construção";
  }

  @Delete(':id/professors/:professorId')
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove um professor de uma turma (Apenas Admins)" })
  removeProfessor(
    @Param('id') id: string, 
    @Param('professorId') professorId: string
  ) {
    return this.classroomsService.removeProfessor(id, professorId);
  }
}