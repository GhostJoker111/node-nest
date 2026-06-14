import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    // ДЕКОРАТОР: значок @UseGuards вешает охранника. Без токена сюда не попадёшь — вернётся 401
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    // ДЕКОРАТОР: значок @CurrentUser() сразу даёт текущего юзера (его положил охранник)
    // Не нужно вручную лезть в запрос, просто пишем @CurrentUser() user
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    getMe(@CurrentUser() user: { id: number; email: string }) {
        return user;
    }
}
