import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../../auth';
import { DatabaseService } from '../database';
import { Student } from '../models';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const authorization = req.headers['authorization'] || '';
    const token = this.getTokenFromHeader(authorization);

    const { data, error } = await this.authService.verifyToken<{ id: string }>(
      token,
    );

    if (error) {
      throw new HttpException({}, StatusCodes.UNAUTHORIZED);
    }

    const user = await this.databaseService.getOneByField(
      Student,
      'id',
      data.id,
    );

    if (!user) {
      throw new HttpException({}, StatusCodes.UNAUTHORIZED);
    }

    req.user = user;

    return true;
  }

  getTokenFromHeader(authorization: string): string {
    return authorization.split(' ')[1];
  }
}
