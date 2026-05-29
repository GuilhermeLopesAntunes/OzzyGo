import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { db } from "src/db";
import { classrooms, professors,students, users } from "src/db/schema";
import { eq } from "drizzle-orm";
import type { NewUser } from "src/db/schema";

@Injectable()
export class UsersService {

 async promoteToProfessor(code: string, userId: string) {
    const professorSecretCode = process.env.PROFESSOR_CODE; 

    if (code !== professorSecretCode) {
        // Se o código tiver errado, já corta por aqui!
        throw new BadRequestException('Código de elevação inválido.');
    }

    await db.transaction(async (tx) => {
        // 1. Atualiza a role do usuário para professor
        await tx.update(users)
            .set({ 
                role: 'professor', 
                updatedAt: new Date() 
            })
            .where(eq(users.id, userId));
            
        // 2. Cria o perfil vazio na tabela de professores
        await tx.insert(professors)
            .values({ id: userId })
            .onConflictDoNothing(); 
    });

    return { message: 'Conta elevada para professor com sucesso.' };
}
    
async findByVerificationToken(token: string){
    return db.query.users.findFirst({
        where: eq(users.verificationToken, token)
    })
}

    async findByResetToken(token: string) {
        return db.query.users.findFirst({
            where: eq(users.resetToken, token)
        })
    }

    async findByEmail(email: string){
        return db.query.users.findFirst(
            {where: eq(users.email, email)}
        )
    }

    async findById(id: string){
        return db.query.users.findFirst(
            {where: eq(users.id, id)}
        )
    }

    async findByUsername(username: string){
        return db.query.users.findFirst(
            {where: eq(users.username, username)}
        )
    }

    async create(data: NewUser){
        const [user] = await db.insert(users).values(data).returning()
        return user;
    }

    async update(id: string, data: Partial<typeof users.$inferInsert>){
        const [user] = await db
        .update(users)
        .set({...data, updatedAt: new Date()})
        .where(eq(users.id, id))
        .returning()

        return user
    }

    async findAll(){
        return db.query.users.findMany()
    }

    async delete(id: string) {
        await db.delete(users).where(eq(users.id,id))
    }
}