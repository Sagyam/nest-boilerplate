import { AuthApiModule } from './auth-api.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const authModule = await NestFactory.create(AuthApiModule);

  const configService = authModule.get<ConfigService>(ConfigService);

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
  const document = SwaggerModule.createDocument(authModule, options);
  const theme = new SwaggerTheme();
  SwaggerModule.setup('auth-docs', authModule, document, {
    customCss: theme.getBuffer[SwaggerThemeNameEnum.DRACULA],
  });

  const isDev = configService.get<string>('NODE_ENV') === 'development';

  authModule.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: isDev,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422,
    transform: true,
  }));

  await authModule.listen(configService.get<number>('PORT'));
}

bootstrap();