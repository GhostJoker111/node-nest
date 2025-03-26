import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function start() {
    const PORT = process.env.PORT || 8000;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
    });

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

start()