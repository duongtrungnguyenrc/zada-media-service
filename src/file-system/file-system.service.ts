import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs";

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);

@Injectable()
export class FileSystemService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(__dirname, "..", "..", this.configService.get<string>("MEDIA_UPLOAD_PATH"));

    this.checkExistingDir();
  }

  async saveFile(fileBuffer: Buffer, mediaId: string): Promise<string> {
    const filePath = this.getFilePath(mediaId);

    try {
      await writeFile(filePath, fileBuffer);
      return filePath;
    } catch (err) {
      throw new InternalServerErrorException("Failed to save file");
    }
  }

  getFile(mediaId: string): fs.ReadStream | null {
    const filePath: string = this.getFilePath(mediaId);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.createReadStream(filePath);
  }

  async checkExistingDir(): Promise<void> {
    try {
      await access(this.uploadDir, fs.constants.F_OK);
    } catch {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  getFilePath(mediaId: string): string {
    return path.join(this.uploadDir, String(mediaId));
  }
}
