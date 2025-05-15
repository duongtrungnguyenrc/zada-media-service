import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors, Body, Res } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { MediaService } from "./media.service";
import { UploadMediaDto } from "./dtos";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: UploadMediaDto) {
    return await this.mediaService.uploadMedia(file, body);
  }

  @Get(":id")
  async stream(@Param("id") id: string, @Res() res: Response) {
    return await this.mediaService.getMedia(id, res);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.mediaService.removeMedia(id);
  }
}
