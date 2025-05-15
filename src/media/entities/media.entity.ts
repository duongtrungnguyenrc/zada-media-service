import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

import { IMedia } from "../interfaces";

@Entity("media")
export class MediaEntity implements IMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  fileName: string;

  @CreateDateColumn()
  createdAt: Date;
}
