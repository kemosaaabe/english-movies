import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { apiPort, frontendOrigin } from './app/constants';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: frontendOrigin, credentials: true });
  await app.listen(apiPort);
};

void bootstrap();
