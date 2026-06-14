import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

/**
 * CommonModule — сразу два паттерна: МОДУЛЬ и ФАБРИКА
 *
 * МОДУЛЬ: это «общая коробка» с проверкой токена (охранник JwtAuthGuard)
 *   - providers: создаём охранника внутри коробки
 *   - exports:   отдаём его наружу, чтобы другие коробки могли им пользоваться
 *   Зачем отдельная коробка: чтобы не было «замкнутого круга» между Auth и Users
 *   (когда A зависит от B, а B от A — программа не стартует). Общую вещь вынесли сюда
 *
 * ФАБРИКА: JwtModule.registerAsync с useFactory
 *   Настройки токена не прописаны намертво, а собираются функцией-рецептом в момент запуска
 *   Секретный ключ функция берёт из ConfigService (настройки из .env)
 */
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService], // что Nest передаст в функцию-рецепт ниже
            useFactory: (config: ConfigService) => ({
                secret: config.get('PRIVATE_KEY') || 'top_secret',
                signOptions: {expiresIn: '12h'},
            }),
        }),
    ],
    providers: [JwtAuthGuard],
    // Отдаём наружу и охранника, и JwtModule. Второе важно: когда другая коробка вешает
    // @UseGuards(JwtAuthGuard), охранник «оживает» уже в ней, и инструмент для проверки токена
    // (JwtService) должен быть виден там же. Поэтому пробрасываем JwtModule дальше.
    exports: [JwtAuthGuard, JwtModule],
})
export class CommonModule {}
