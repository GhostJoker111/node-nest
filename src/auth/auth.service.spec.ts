import { Test } from '@nestjs/testing';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
    let authService: AuthService;
    
    const usersService = {
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
    };
    const jwtService = {
        sign: jest.fn().mockReturnValue('fake.jwt.token'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        authService = moduleRef.get(AuthService);
    });

    describe('registration', () => {
        it('хэширует пароль и возвращает токен', async () => {
            usersService.getUserByEmail.mockResolvedValue(null);
            usersService.createUser.mockImplementation(async (dto) => ({ id: 1, ...dto }));

            const result = await authService.registration({ email: 'new@test.com', password: 'qwerty123' });

            expect(result).toEqual({ token: 'fake.jwt.token' });

            const savedPassword = usersService.createUser.mock.calls[0][0].password;
            expect(savedPassword).not.toBe('qwerty123');
            expect(await bcrypt.compare('qwerty123', savedPassword)).toBe(true);
        });

        it('кидает 400, если email уже занят', async () => {
            usersService.getUserByEmail.mockResolvedValue({ id: 1, email: 'busy@test.com' });

            await expect(
                authService.registration({ email: 'busy@test.com', password: 'qwerty123' }),
            ).rejects.toThrow(HttpException);
            expect(usersService.createUser).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('возвращает токен при верном пароле', async () => {
            const hash = await bcrypt.hash('qwerty123', 5);
            usersService.getUserByEmail.mockResolvedValue({ id: 1, email: 'user@test.com', password: hash });

            const result = await authService.login({ email: 'user@test.com', password: 'qwerty123' });

            expect(result).toEqual({ token: 'fake.jwt.token' });
        });

        it('кидает 401 при неверном пароле', async () => {
            const hash = await bcrypt.hash('qwerty123', 5);
            usersService.getUserByEmail.mockResolvedValue({ id: 1, email: 'user@test.com', password: hash });

            await expect(
                authService.login({ email: 'user@test.com', password: 'wrong' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('кидает 401, если email не существует', async () => {
            usersService.getUserByEmail.mockResolvedValue(null);

            await expect(
                authService.login({ email: 'ghost@test.com', password: 'qwerty123' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
