import { createNestroApplication } from "@duongtrungnguyen/nestro";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18nMiddleware } from "nestjs-i18n";

import { AppModule } from "~app.module";

async function bootstrap() {
  const configService: ConfigService = new ConfigService();

  const app = await createNestroApplication(AppModule, {
    server: {
      host: configService.get<string>("NESTRO_HOST"),
      port: configService.get<number>("NESTRO_PORT"),
    },
    client: {
      name: configService.getOrThrow<string>("SERVICE_NAME"),
      host: configService.get<string>("SERVICE_HOST"),
      port: configService.get<number>("SERVICE_PORT"),
    },
  });

  app.setGlobalPrefix("media");

  app.use(I18nMiddleware);
  app.useGlobalPipes(new ValidationPipe());

  const documentConfig = new DocumentBuilder().build();
  const swaggerDocument = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup("api", app, swaggerDocument, {
    jsonDocumentUrl: "api-docs-json",
  });

  await app.listen();
}
bootstrap();
