import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: new Date() })
  createAt: Date;

  @Column({ default: new Date() })
  updateAt: Date;
}
