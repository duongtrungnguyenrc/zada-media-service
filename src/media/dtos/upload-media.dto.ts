import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadMediaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fileName?: string;
}
