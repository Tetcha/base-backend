import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as joi from 'joi';
import { joiPasswordExtendCore, JoiPasswordExtend } from 'joi-password';

const joiPassword: JoiPasswordExtend = joi.extend(joiPasswordExtendCore);

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ name: 'isverified' })
  isVerified: boolean;

  @Column({ name: 'googleid' })
  googleId: string;

  @Column({ name: 'facebookid' })
  facebookId: string;
}

export const accountValidateSchema = {
  name: joi.string().min(5).max(40).trim().lowercase().required(),
  email: joi.string().min(5).max(255).email().trim().lowercase().required(),
  password: joiPassword.string().min(8).max(32).noWhiteSpaces().required(),
};
