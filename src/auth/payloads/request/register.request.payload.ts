import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { accountValidateSchema } from '../../../core/models';

export class RegisterRequestPayload {
  @ApiProperty({ description: 'Username', example: 'haicao@gmail.com' })
  email: string;

  @ApiProperty({ description: 'Name', example: 'Cao Chi Hai' })
  name: string;

  @ApiProperty({ description: 'Password', example: 'Aa123456' })
  password: string;

  @ApiProperty({ description: 'Confirm password', example: 'Aa123456' })
  confirmPassword: string;
}

export const vRegisterRequestPayload = joi.object<RegisterRequestPayload>({
  name: accountValidateSchema.name,
  email: accountValidateSchema.email,
  password: accountValidateSchema.password,
  confirmPassword: joi.string().required().valid(joi.ref('password')),
});
