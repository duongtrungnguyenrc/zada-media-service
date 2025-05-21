import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

import { IMedia } from "../interfaces";

@Entity("media")
export class MediaEntity implements IMedia {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ length: 20 })
  userId: string;

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
