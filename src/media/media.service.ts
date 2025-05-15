import { ResponseEntity } from "@duongtrungnguyen/micro-commerce";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";
import { Response } from "express";

import { FileSystemService } from "~file-system";

import { MediaEntity } from "./entities";
import { UploadMediaDto } from "./dtos";
import { IMedia } from "./interfaces";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    private readonly fileSystemService: FileSystemService,
    private readonly i18nService: I18nService,
  ) {}

  async uploadMedia(file: Express.Multer.File, data: UploadMediaDto): Promise<ResponseEntity<undefined>> {
    const fileName = `${Date.now()}-${data.fileName || file.originalname}`;

    const media = this.mediaRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      fileName,
    });

    await this.mediaRepository.save(media);

    await this.fileSystemService.saveFile(file.buffer, media.id.toString());

    return {
      message: this.i18nService.t("media.uploaded-success"),
      data: undefined,
      code: 201,
    };
  }

  async removeMedia(id: string): Promise<ResponseEntity<undefined>> {
    const media = await this.mediaRepository.findOneBy({ id });

    if (!media) throw new NotFoundException(this.i18nService.t("media.not-found"));

    await this.mediaRepository.remove(media);

    return {
      message: this.i18nService.t("media.remove-success"),
      data: undefined,
      code: 200,
    };
  }

  async getMedia(id: string, response: Response): Promise<void> {
    const media: IMedia = await this.mediaRepository.findOneBy({ id });

    if (!media) throw new NotFoundException(this.i18nService.t("media.not-found"));

    const stream = this.fileSystemService.getFile(media.id);

    if (!stream) throw new NotFoundException(this.i18nService.t("media.not-found"));

    response.set({
      "Content-Type": media.mimeType,
      "Content-Length": media.size,
      "Content-Disposition": `inline; filename="${media.fileName}"`,
    });

    stream.pipe(response);
  }
}
