# Users — NestJS + PostgreSQL + React

Учебный fullstack-проект: REST API на [NestJS](https://nestjs.com) с JWT-аутентификацией, база PostgreSQL, фронтенд на React. Всё запускается в Docker одной командой.

## Стек

- **Backend** — NestJS (TypeScript), порт `8000`
- **Frontend** — React (Create React App), в проде отдаётся через nginx, порт `3001`
- **База данных** — PostgreSQL 16
- **CI/CD** — GitHub Actions: сборка и публикация Docker-образов в GitHub Container Registry

## Быстрый старт (Docker)

Понадобится только [Docker](https://docs.docker.com/get-docker/) — Node.js и PostgreSQL на машине не нужны.

```bash
git clone <url-репозитория>
cd <папка-репозитория>

# создать файл с переменными окружения
cp .env.example .env
# откройте .env и замените пароли/секреты на свои

docker compose up --build
```

После запуска:

| Сервис   | Адрес                  |
|----------|------------------------|
| Frontend | http://localhost:3001  |
| API      | http://localhost:8000  |
| Postgres | localhost:5432         |

Остановить:

```bash
docker compose down        # остановить контейнеры
docker compose down -v     # + удалить данные базы
```

## Переменные окружения

| Переменная          | Описание                                    |
|---------------------|---------------------------------------------|
| `POSTGRES_USER`     | Пользователь PostgreSQL                     |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL                           |
| `POSTGRES_DB`       | Имя базы данных                             |
| `PRIVATE_KEY`       | Секрет для подписи JWT-токенов              |
| `PORT`              | Порт бэкенда (только для запуска без Docker)|
| `POSTGRES_HOST`     | Хост БД (только для запуска без Docker)     |
| `POSTGRES_PORT`     | Порт БД (только для запуска без Docker)     |

`docker-compose` сам задаёт `PORT` и `POSTGRES_HOST` внутри сети контейнеров — последние три переменные нужны, только если запускаете бэкенд напрямую на машине.

## Запуск без Docker (для разработки)

Нужны Node.js 20+ и запущенный PostgreSQL с базой из `.env`.

```bash
# backend (порт 8000)
npm ci
npm run start:dev

# frontend (порт 3000, в отдельном терминале)
cd frontend
npm ci
npm start
```

## Тесты

```bash
# unit-тесты (база не нужна, все зависимости замоканы)
npm test

# e2e-тесты: реальные HTTP-запросы к приложению, нужна база
docker compose up -d postgres
npm run test:e2e
```

CI прогоняет оба вида тестов при каждом пуше в `main`.

## CI/CD

При пуше в `main` GitHub Actions запускает две параллельные джобы:

- **backend** — проверка сборки (`nest build`) и публикация образа `ghcr.io/ghostjoker111/node-nest:latest`
- **frontend** — сборка CRA и публикация образа `ghcr.io/ghostjoker111/node-nest-frontend:latest`

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)