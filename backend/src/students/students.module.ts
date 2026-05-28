import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
