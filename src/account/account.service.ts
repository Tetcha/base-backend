import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from '../core';

@Injectable()
export class AccountService {
  constructor(private dataSource: DataSource) {}

  getAccountByGoogleId(googleId: string) {
    return this.dataSource
      .getRepository(Account)
      .createQueryBuilder()
      .where('googleId = :googleId', { googleId })
      .getOne();
  }

  getAccountByFacebookId(facebookId: string) {
    return this.dataSource
      .getRepository(Account)
      .createQueryBuilder()
      .where('facebookId = :facebookId', { facebookId })
      .getOne();
  }

  createAccount(account: Account) {
    return this.dataSource.getRepository(Account).save(account);
  }
}
