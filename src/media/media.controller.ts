import {
  AuthTokenPayload,
  BadRequestExceptionVM,
  ForbiddenExceptionVM,
  HttpExceptionsFilter,
  HttpResponse,
  NotFoundExceptionVM,
  ResponseVM,
  UnauthorizedExceptionVM,
} from "@duongtrungnguyen/micro-commerce";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors, Body, Res, UseFilters } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { I18nService } from "nestjs-i18n";
import { Response } from "express";

import { MediaService } from "./media.service";
import { UploadMediaDto } from "./dtos";
import { MediaResponseVM } from "./vms";

@ApiTags("Media")
@Controller()
@UseFilters(HttpExceptionsFilter)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly i18nService: I18nService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload media" })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Media uploaded success", type: MediaResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  @ApiCreatedResponse({ description: "Media uploaded success", type: MediaResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  async upload(@AuthTokenPayload("sub") userId: string, @UploadedFile() file: Express.Multer.File, @Body() body: UploadMediaDto) {
    const media = await this.mediaService.upload(userId, file, body);

    return HttpResponse.ok(this.i18nService.t("media.uploaded-success"), media);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get media" })
  @ApiConsumes("image/*", "video/*")
  @ApiOkResponse({ description: "Get media success" })
  @ApiNotFoundResponse({ description: "Media not found", type: NotFoundExceptionVM })
  async stream(@Param("id") id: string, @Res() res: Response) {
    return await this.mediaService.get(id, res);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete media" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Media deleted success", type: ResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "User forbidden to delete", type: ForbiddenExceptionVM })
  @ApiNotFoundResponse({ description: "Media not found", type: NotFoundExceptionVM })
  async delete(@AuthTokenPayload("sub") userId: string, @Param("id") id: string): Promise<ResponseVM> {
    await this.mediaService.delete(userId, id);

    return HttpResponse.ok(this.i18nService.t("media.remove-success"));
  }
}
