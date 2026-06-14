import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    // ФАБРИКА: registerAsync + useFactory.
    // функция собирает настройки при запуске и берёт секрет из ConfigService
    // настройки зависят от другого сервиса, и такой код проще тестировать и менять
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('PRIVATE_KEY') || 'top_secret',
        signOptions: {expiresIn: '12h'},
      }),
    }),
  ],
})
export class AuthModule {}
