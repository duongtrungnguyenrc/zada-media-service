import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { FileSystemModule } from "~file-system";

import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { MediaEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity]), FileSystemModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
