import './tracer';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact(
      'Your Name',
      'your-website.com',
      'email@domain.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const theme = new SwaggerTheme();
  SwaggerModule.setup('api-docs', app, document, {
    customCss: theme.getBuffer[SwaggerThemeNameEnum.DRACULA],
  });

  const isDev = configService.get<string>('NODE_ENV') === 'development';

  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: isDev,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422,
    transform: true,
  }));

  await app.listen(configService.get<number>('PORT'));
}

bootstrap();