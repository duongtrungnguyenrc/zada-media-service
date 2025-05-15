import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { FileSystemModule } from "~file-system";
import { MediaEntity } from "~media/entities";

import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity]), FileSystemModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
