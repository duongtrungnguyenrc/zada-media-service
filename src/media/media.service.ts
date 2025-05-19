import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";
import { Response } from "express";

import { FileSystemService } from "~file-system";

import { MediaEntity } from "./entities";
import { UploadMediaDto } from "./dtos";
import { IMedia } from "./interfaces";
import { MediaVM } from "./vms";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    private readonly fileSystemService: FileSystemService,
    private readonly i18nService: I18nService,
  ) {}

  async upload(userId: string, file: Express.Multer.File, data: UploadMediaDto): Promise<MediaVM> {
    const fileName = `${Date.now()}-${data.fileName || file.originalname}`;

    const media = this.mediaRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      userId,
      fileName,
    });

    await this.mediaRepository.save(media);

    await this.fileSystemService.saveFile(file.buffer, media.id.toString());

    return media;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const media = await this.mediaRepository.findOne({ where: { id }, select: ["id", "userId"] });

    if (!media) throw new NotFoundException(this.i18nService.t("media.not-found"));

    if (media.id !== userId) throw new ForbiddenException(this.i18nService.t("media.forbidden-delete"));

    await this.mediaRepository.remove(media);

    return true;
  }

  async get(id: string, response: Response): Promise<void> {
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
