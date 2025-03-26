import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";
import {UsersService} from "../users/users.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, JwtModule.register({
    secret: process.env.PRIVATE_KEY || "top_secret",
    signOptions: {
      expiresIn: "12h"
    }
  })],
})
export class AuthModule {}
