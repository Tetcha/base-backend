import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(private readonly dataSource: DataSource) {}
}
