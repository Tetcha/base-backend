import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as joi from 'joi';
import { BaseModel } from './base.model';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class Student extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  birthday: Date;

  @Column({ unique: true })
  studentCode: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  gender: GENDER;

  @Column({ default: 0 })
  balance: number;

  @Column()
  status: boolean;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'googleid', unique: true })
  googleId: string;

  @Column({ name: 'facebookid', unique: true })
  facebookId: string;
}

export const accountValidateSchema = {
  name: joi.string().min(5).max(40).trim().lowercase().required(),
  email: joi.string().min(5).max(255).email().trim().lowercase().required(),
};
