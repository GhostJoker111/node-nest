import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/users.model';

describe('Auth + Users (e2e)', () => {
    let app: INestApplication;

    const email = `e2e-${Date.now()}@test.com`;
    const password = 'qwerty123';
    let token: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        const userModel = app.get<typeof User>(getModelToken(User));
        await userModel.destroy({ where: { email } });
        await app.close();
    });

    it('POST /auth/registration — регистрирует и возвращает токен', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/registration')
            .send({ email, password })
            .expect(201);

        expect(res.body.token).toBeDefined();
    });

    it('POST /auth/registration — повторный email → 400', () =>
        request(app.getHttpServer())
            .post('/auth/registration')
            .send({ email, password })
            .expect(400));

    it('POST /auth/login — верные данные → токен', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password })
            .expect(201);

        token = res.body.token;
        expect(token).toBeDefined();
    });

    it('POST /auth/login — неверный пароль → 401', () =>
        request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password: 'wrong-password' })
            .expect(401));

    it('POST /auth/login — несуществующий email → 401', () =>
        request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: `ghost-${Date.now()}@test.com`, password })
            .expect(401));

    it('GET /users — без токена → 401', () =>
        request(app.getHttpServer()).get('/users').expect(401));

    it('GET /users — с токеном → 200, и в ответе нет паролей', async () => {
        const res = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        for (const user of res.body) {
            expect(user.password).toBeUndefined();
        }
    });
});
