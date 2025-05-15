import { TypeOrmExceptionInterceptor } from "@duongtrungnguyen/micro-commerce";
import { createNestroApplication } from "@duongtrungnguyen/nestro";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18nService } from "nestjs-i18n";

import { AppModule } from "~app.module";

async function bootstrap() {
  const configService: ConfigService = new ConfigService();

  const app = await createNestroApplication(AppModule, {
    server: {
      host: configService.get<string>("NESTRO_HOST"),
      port: configService.get<number>("NESTRO_PORT"),
    },
    client: {
      name: configService.get<string>("SERVICE_NAME"),
    },
  });

  const i18nService = app.get<I18nService>(I18nService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TypeOrmExceptionInterceptor(i18nService));

  await app.listen();
}
bootstrap();
