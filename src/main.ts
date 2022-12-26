import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { useRequestLogging } from './middleware/logger.middleware';
import { Logger, ValidationPipe } from '@nestjs/common';

// This allows TypeScript to detect our global value
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
        }
    }
}

global.__rootdir__ = __dirname || process.cwd();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('TAKE ME AND SAVE ME API')
            .setDescription('The TAKE ME AND SAVE ME API documentacion')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
        SwaggerModule.setup('docs', app, document);

        useRequestLogging(app);
    }

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
          Logger.log(`App listen on http://localhost:${process.env.PORT}`);
          Logger.log(`Swagger listen on http://localhost:${process.env.PORT}/docs`);
      }
  });
}
bootstrap();
