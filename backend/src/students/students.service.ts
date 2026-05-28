import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db';
import { classrooms, students, users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class StudentsService {
  
  async getProfile(userId: string) {
    const studentProfile = await db.query.students.findFirst({
      where: eq(students.id, userId),
      with: {
        user: true, 
      }
    });

    if (!studentProfile) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    return studentProfile;
  }



async joinClassroom(userId: string, code: string) {
    const classroom = await db.query.classrooms.findFirst({
        where: eq(classrooms.code, code)
    });

    if (!classroom) {
        throw new NotFoundException('Código de turma inválido ou não encontrado.');
    }


    const [student] = await db.insert(students)
        .values({ 
            id: userId, 
            classroomId: classroom.id 
        })
        .onConflictDoUpdate({
            target: students.id,
            set: { 
                classroomId: classroom.id, 
                updatedAt: new Date()
            }
        })
        .returning();

    return { 
        message: 'Bem-vindo à turma!', 
        classroomName: classroom.name,
        studentProfile: student
    };
}

  async addXp(userId: string, xpGained: number) {
    const student = await this.getProfile(userId);
    
    const newCurrentXp = student.currentXp + xpGained;
    const newTotalXp = student.totalXp + xpGained;
    
    const [updatedStudent] = await db.update(students)
      .set({ 
        currentXp: newCurrentXp,
        totalXp: newTotalXp,
        updatedAt: new Date()
      })
      .where(eq(students.id, userId))
      .returning();

    return updatedStudent;
  }
  async findAll() {
    return await db.query.students.findMany({
      with: {
        user: true, 
      }
    });
  }

  async findOne(id: string) {
    const student = await db.query.students.findFirst({
      where: eq(students.id, id),
      with: {
        user: true,
      }
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado.');
    }

    return student;
  }

  async deactivate(id: string) {

    await this.findOne(id); 

  
    await db.update(users)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));

    return { message: 'Estudante desativado com sucesso.' };
  }

  
}