import { ApiProperty } from "@nestjs/swagger";

export class MediaVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;
}
