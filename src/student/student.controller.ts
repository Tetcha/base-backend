import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { DatabaseService, serialize, StudentGuard } from '../core';
import { StudentResponseDTO } from './dto/student.response.dto';

@ApiTags('Projects')
@Controller('student')
export class StudentController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(StudentGuard)
  @serialize(StudentResponseDTO)
  getProfile(@Req() req: Request, @Res() res: Response) {
    return { res: res, data: req.user, statusCode: 200 };
  }
}
