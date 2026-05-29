import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { db } from 'src/db';
import { classrooms, professorClassrooms } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {

  // Gerador de código (os alunos usarão isso para entrar na turma)
  private generateClassCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // 1. Criação da turma (Feito pelo Admin)
  async create(createClassroomDto: CreateClassroomDto) {
    try {
      const uniqueCode = this.generateClassCode();

      // Como o admin só cria a turma, não precisamos mais da transaction aqui
      const [newClassroom] = await db.insert(classrooms)
        .values({
          name: createClassroomDto.name,
          schoolId: createClassroomDto.schoolId,
          code: uniqueCode,
        })
        .returning();

      return newClassroom;

    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Conflito gerando o código da turma ou nome duplicado.');
      }
      throw new InternalServerErrorException('Erro interno ao criar a turma.');
    }
  }

  // 2. Vinculando o Professor à Turma (Relação N:N)
  async assignProfessor(classroomId: string, professorId: string) {
    try {
      // Insere na tabela de relacionamento N:N
      await db.insert(professorClassrooms)
        .values({
          classroomId: classroomId,
          professorId: professorId,
        })
        .onConflictDoNothing(); // Se o professor já estiver na turma, não dá erro, apenas ignora

      return { message: 'Professor vinculado à turma com sucesso.' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao vincular o professor à turma.');
    }
  }


  async joinAsProfessor(classroomId: string, professorId: string) {
    try {

      await db.insert(professorClassrooms)
        .values({
          classroomId: classroomId,
          professorId: professorId,
        })
        .onConflictDoNothing(); // Se ele tentar entrar de novo na mesma turma, apenas ignora

      return { message: 'Você ingressou na turma com sucesso.' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao ingressar na turma.');
    }
  }

  // 3. Removendo um Professor da Turma
  async removeProfessor(classroomId: string, professorId: string) {
    try {
      await db.delete(professorClassrooms)
        .where(
          eq(professorClassrooms.classroomId, classroomId) && 
          eq(professorClassrooms.professorId, professorId)
        );

      return { message: 'Professor removido da turma com sucesso.' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover o professor da turma.');
    }
  }

  async findAll() {
    return await db.query.classrooms.findMany({
      where: eq(classrooms.active, true)
    });
  }

  async findOne(id: string) { 
    return await db.query.classrooms.findFirst({
      where: eq(classrooms.id, id)
    });
  }
}