import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Observable} from 'rxjs';

/**
 * JwtAuthGuard — «охранник» на входе в метод. Пример паттерна ДЕКОРАТОР
 *
 * Проверяет токен ДО того, как сработает метод контроллера
 * Нет токена или он плохой — дальше не пускает (ошибка 401)
 *
 * Куда вешается: значком @UseGuards(JwtAuthGuard) над методом — см. users.controller.ts
 * Что делает:    берёт заголовок "Authorization: Bearer <токен>", проверяет его
 *                Если ок — кладёт данные юзера в request.user, оттуда их потом достаёт @CurrentUser()
 * Зачем:         написали проверку один раз — вешаем куда нужно, не дублируя код
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        const authHeader: string | undefined = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }

        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message: 'Некорректный формат токена'});
        }

        try {
            // verify проверяет подпись и срок жизни; кидает ошибку если токен невалиден
            req.user = this.jwtService.verify(token);
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }
    }
}
