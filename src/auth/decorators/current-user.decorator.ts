import {createParamDecorator, ExecutionContext} from '@nestjs/common';

/**
 * @CurrentUser() — наш собственный «значок». Пример паттерна ДЕКОРАТОР
 *
 * Простыми словами: пишешь @CurrentUser() user — и сразу получаешь текущего юзера
 * Без него пришлось бы в каждом методе вручную лезть в запрос и доставать юзера, а это уже нарушение DRY
 *
 * Куда ставится: перед параметром метода: getMe(@CurrentUser() user) { ... }
 * Откуда юзер:   его туда положил охранник JwtAuthGuard (в request.user)
 * Бонус:         можно достать одно поле — @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user; // сюда payload положил JwtAuthGuard
        return data ? user?.[data] : user;
    },
);
