import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GENDER } from '../../core';

export class StudentResponseDTO {
  @ApiProperty({ description: 'Id', example: 'asd-sd-ssd' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Birthday', example: '2001-09-21' })
  @Expose()
  birthday: Date;

  @ApiProperty({ description: 'Student Code', example: 'SE1500' })
  @Expose()
  studentCode: string;

  @ApiProperty({ description: 'Phone', example: '0912212221' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Gender', example: 'MALE' })
  @Expose()
  gender: GENDER;

  @ApiProperty({ description: 'Balance', example: '12000' })
  @Expose()
  balance: number;

  @ApiProperty({ description: 'Name', example: 'Ben' })
  @Expose()
  name: number;

  @ApiProperty({ description: 'Email', example: 'Ben@gmail.com' })
  @Expose()
  email: string;
}
