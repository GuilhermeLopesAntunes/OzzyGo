import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
