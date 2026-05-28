import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { db } from 'src/db';
import { professors, users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProfessorsService {


  async promoteToProfessor(code: string, userId: string) {
    const professorSecretCode = process.env.PROFESSOR_CODE; 

    if (code !== professorSecretCode) {
      throw new BadRequestException('Código de elevação inválido.');
    }

    try {
  
      await db.insert(professors)
        .values({ id: userId })
        .onConflictDoNothing(); 

      await db.update(users)
        .set({ 
          role: 'professor', 
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));

      return { message: 'Parabéns! Sua conta foi elevada para Professor.' };

    } catch (error) {

      throw new InternalServerErrorException('Erro ao processar a promoção no banco de dados.');
    }
}

  async getProfile(userId: string) {
    const professorProfile = await db.query.professors.findFirst({
      where: eq(professors.id, userId),
      with: {
        user: true, 
      }
    });

    if (!professorProfile) {
      throw new NotFoundException('Perfil de professor não encontrado.');
    }

    return professorProfile;
  }


  async updateSpecialization(userId: string, specialization: string) {

    const [updatedProfessor] = await db.update(professors)
      .set({ 
        specialization: specialization, 
        updatedAt: new Date() 
      })
      .where(eq(professors.id, userId))
      .returning();

    return { 
      message: 'Especialização atualizada com sucesso!', 
      profile: updatedProfessor 
    };
  }

  async findAll() {
    return await db.query.professors.findMany({
      with: { user: true }
    });
  }
}