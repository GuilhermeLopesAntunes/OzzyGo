import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SchoolsModule } from './schools/schools.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20
      }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      
    }),
    JwtModule.register({global: true}),
    UserModule,
    AuthModule,
    SchoolsModule
  ],
  providers: [
    {
      provide: APP_GUARD, useClass: ThrottlerGuard
      
    },
    {
      provide: APP_GUARD, useClass: JwtAuthGuard
      
    },
    {
      provide: APP_GUARD, useClass: RolesGuard
      
    }
  ]
})
export class AppModule {}
