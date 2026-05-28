import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import type { NewSchool } from "src/db/schema";
import { schools } from 'src/db/schema';


type error = {
  code: string
}

@Injectable()
export class SchoolsService {


  async create(createSchoolDto: CreateSchoolDto) {
    try {
      const [NewSchool] = await db.insert(schools)
      .values({
        name: createSchoolDto.name,
        code: createSchoolDto.code
      })
      .returning()

      return NewSchool
    } catch (error) {
      if ((error as error).code === '23505') {
                throw new ConflictException('Já existe uma escola com este código.');
            }
            throw new InternalServerErrorException('Erro ao criar a escola.');
    }
  }

  async findAll() {
    return await db.query.schools.findMany({
            where: eq(schools.active, true)
        });
  }

  findOne(id: string) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
