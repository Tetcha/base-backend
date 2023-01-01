import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { accountValidateSchema } from '../../../core/models';

export class LoginRequestPayload {
  @ApiProperty({ description: 'Username', example: 'haicao@gmail.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'Aa123456' })
  password: string;
}

export const vLoginRequestPayload = joi.object<LoginRequestPayload>({
  email: accountValidateSchema.email,
  password: accountValidateSchema.password,
});
