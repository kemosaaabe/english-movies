import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiPort, frontendOrigin } from './app/constants';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: frontendOrigin });
  await app.listen(apiPort);
};

void bootstrap();
