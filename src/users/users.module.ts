import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CommonModule} from "../common/common.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // MODULE: импортим CommonModule => получаем экспортированный оттуда JwtAuthGuard
  // Без цикла с AuthModule (guard живёт в CommonModule, а не в AuthModule)
  imports: [SequelizeModule.forFeature([User]), CommonModule],
  exports: [UsersService],
})
export class UsersModule {}
