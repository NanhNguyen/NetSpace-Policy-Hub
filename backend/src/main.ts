import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Polyfill for crypto.randomUUID for Node 18
if (!global.crypto) {
  global.crypto = require('crypto');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: '*', // In production, specify the actual frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
