import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { logLevels } from './loggerInfo';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      levels: logLevels.levels,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
          level: 'error',
        }),
        new winston.transports.File({
          filename: `logs/logfile-${Date.now()}`,
          format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.json(),
          ),
          level: 'error',
        }),
      ],
    }),
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
  Logger.log(`${process.env.STAGE} running on ${port}`);
}
bootstrap();
