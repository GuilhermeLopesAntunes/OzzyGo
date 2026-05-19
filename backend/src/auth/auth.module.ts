import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmailService } from "./email.service";
import { UserModule } from "src/users/users.module";


@Module({
    imports: [
        UserModule,
        JwtModule.register({})

    ],
    controllers: [AuthController],
    providers: [AuthService, EmailService]
})
export class AuthModule{}