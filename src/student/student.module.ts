import { Module } from '@nestjs/common';
import { DatabaseModule } from '../core';
import { AuthModule } from '../auth';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
