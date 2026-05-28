import { Module } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
})
export class ProfessorsModule {}
