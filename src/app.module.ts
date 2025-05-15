import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import * as path from "path";

import { FileSystemModule } from "~file-system";
import { MediaModule } from "~media";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "i18n"),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ["lang"],
        },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang"]),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST"),
        port: configService.get<number>("POSTGRES_PORT"),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [path.join(__dirname, "**", "*.entity{.ts,.js}")],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MediaModule,
    FileSystemModule,
  ],
})
export class AppModule {}
