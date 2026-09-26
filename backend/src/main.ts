import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';

import { AppModule } from './app.module';
import { apiPort, frontendOrigin, unsafeMethods } from './app/constants';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use((request: Request, response: Response, next: NextFunction) => {
    if (unsafeMethods.has(request.method) && request.headers.origin && request.headers.origin !== frontendOrigin) {
      response.status(403).json({ message: 'Invalid request origin.' });

      return;
    }

    next();
  });

  app.enableCors({ origin: frontendOrigin, credentials: true });
  await app.listen(apiPort);
};

void bootstrap();
