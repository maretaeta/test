import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const corsOptions = {
      origin: 'http://localhost:5173', 
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    };

    app.enableCors(corsOptions);

    await app.listen(4000);

    console.log("Successfully started on port 4000");
  } catch (error) {
    console.error("Error starting Nest.js application:", error);
  }
}

bootstrap();
