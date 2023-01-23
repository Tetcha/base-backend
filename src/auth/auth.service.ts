import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Student, constant, DatabaseService } from '../core';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly dataSource: DataSource,
  ) {}

  async login(): Promise<string> {
    const account = await this.dataSource.getRepository(Student).find()[0];

    return await this.createAccessToken(account);
  }

  async createAccountWithOAuth(
    name: string,
    email: string,
    oauthId: string,
    oauthType: string,
  ): Promise<Student> {
    const account = new Student();
    account.name = name;
    account.email = email;
    if (oauthType === 'google') account.googleId = oauthId;
    else if (oauthType === 'facebook') account.facebookId = oauthId;
    return await this.databaseService.createOne<Student>(Student, account);
  }

  async handleOAuthCallBack(req: Request, res: Response) {
    const accessToken = await this.createAccessToken(req.account as Student);
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

  async createAccessToken(account: Student, minutes?: number): Promise<string> {
    return this.encryptAccessToken({ id: account.id }, minutes);
  }

  async verifyToken<T>(tokenData: string): Promise<{ data: T; error: any }> {
    try {
      return {
        data: (await this.jwtService.verifyAsync<any>(tokenData)) as T,
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
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
