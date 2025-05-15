import { IsOptional, IsString } from "class-validator";

export class UploadMediaDto {
  @IsString()
  @IsOptional()
  fileName?: string;
}
