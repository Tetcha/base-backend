import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, DbModule } from './config';
import { AuthModule } from './auth';
import { StudentController } from './student/student.controller';
import { StudentService } from './student/student.service';
import { StudentModule } from './student/student.module';
import { DatabaseModule } from './core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      load: [configuration],
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    StudentModule,
    DatabaseModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class AppModule {}
