import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Account, constant, DatabaseService } from '../core';
import {
  LoginRequestPayload,
  RegisterRequestPayload,
} from './payloads/request';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async register(
    registerRequestPayload: RegisterRequestPayload,
  ): Promise<string> {
    const { name, email, password } = registerRequestPayload;
    const existedAccount = await this.databaseService.getOneByField(
      Account,
      'email',
      email,
    );
    if (existedAccount)
      throw new HttpException(
        { email: 'field.field-taken' },
        StatusCodes.BAD_REQUEST,
      );
    const newAccount = await this.createAccount(name, email, password);
    return await this.createAccessToken(newAccount);
  }

  async login(loginRequestPayload: LoginRequestPayload): Promise<string> {
    const { email, password } = loginRequestPayload;
    const account = await this.databaseService.getOneByField(
      Account,
      'email',
      email,
    );
    if (!account)
      throw new HttpException(
        { errorMessage: 'error.invalid-password-username' },
        StatusCodes.BAD_REQUEST,
      );

    const isCorrectPassword = await this.decryptPassword(
      password,
      account.password,
    );
    if (!isCorrectPassword)
      throw new HttpException(
        { errorMessage: 'error.invalid-password-username' },
        StatusCodes.BAD_REQUEST,
      );
    return await this.createAccessToken(account);
  }

  async createAccount(
    name: string,
    email: string,
    password: string,
  ): Promise<Account> {
    const account = new Account();
    account.name = name;
    account.email = email;
    account.password = await this.encryptPassword(
      password,
      constant.default.hashingSalt,
    );
    return await this.databaseService.createOne(Account, account);
  }

  async createAccountWithOAuth(
    name: string,
    email: string,
    oauthId: string,
    oauthType: string,
  ): Promise<Account> {
    const account = new Account();
    account.name = name;
    account.email = email;
    account.password = '';
    if (oauthType === 'google') account.googleId = oauthId;
    else if (oauthType === 'facebook') account.facebookId = oauthId;
    return await this.databaseService.createOne<Account>(Account, account);
  }

  async handleOAuthCallBack(req: Request, res: Response) {
    const accessToken = await this.createAccessToken(req.account as Account);
    return res
      .cookie(constant.authController.tokenName, accessToken, {
        maxAge: constant.authController.googleUserCookieTime,
      })
      .redirect(this.configService.get<string>('client.clientRedirectUrl'));
  }

  // ---------------------------Token Service---------------------------
  async encryptAccessToken(tokenData: Record<any, any>, minutes?: number) {
    try {
      if (minutes) {
        return await this.jwtService.signAsync(tokenData, {
          expiresIn: minutes * 60,
        });
      } else {
        return this.jwtService.signAsync(tokenData);
      }
    } catch (err) {
      return null;
    }
  }

  async createAccessToken(account: Account, minutes?: number): Promise<string> {
    return this.encryptAccessToken({ id: account.id }, minutes);
  }

  // ---------------------------Bcrypt Service---------------------------
  async encryptPassword(
    password: string,
    saltOrRounds: number,
  ): Promise<string> {
    return await bcrypt.hash(password, saltOrRounds);
  }

  async decryptPassword(
    enteredPassword: string,
    passwordInDatabase: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, passwordInDatabase);
  }
}
