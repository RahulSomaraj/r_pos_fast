import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { AppModule } from './app.module';
import cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';

process.env.TZ = 'Asia/Kolkata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.use(cors());
  app.enableCors({
    origin: ['https://admin.thenewshop.in', 'https://pos.thenewshop.in/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });
  // app.enableCors(); // add whitelist domain as string array & set credentials-true as the part of security.
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get('APP_CONFIG.PORT');
  const config = new DocumentBuilder()
    .setTitle('NewShop API')
    .setDescription('NewShop API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidUnknownValues : false,
      // forbidNonWhitelisted: true,
      // whitelist: true,
    }),
  );

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    // Optionally, you can perform additional actions here, such as logging or cleanup.
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT, () => {
    Logger.log(`Server Started at ${PORT}`);
  });
}
bootstrap();
