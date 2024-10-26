import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ValidationPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { GlobalFilter } from './common/filter/global/global.filter';
import { PrismaFilter } from './common/filter/prisma/prisma.filter';
import { AuthGuard } from './common/guard/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // 设置校验失败后的响应数据格式
      exceptionFactory: (errors: ValidationError[]) => {
        // 此处要注意，errors是一个对象数组，包含了当前所调接口里，所有验证失败的参数及错误信息。
        // 此处的处理是只返回第一个错误信息
        const message = Object.values(errors[0].constraints!)[0];
        return new BadRequestException({
          message,
          code: HttpStatus.BAD_REQUEST,
        });
      },
    }),
  );

  app.useGlobalGuards(new AuthGuard());

  // 全局错误捕获器
  app.useGlobalFilters(new GlobalFilter());
  app.useGlobalFilters(new PrismaFilter());

  const config = new DocumentBuilder()
    .setTitle('NestjsAPI')
    .setDescription('The Nestjs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swaggerApiDocs', app, document);

  await app.listen(3000);
}
bootstrap();
