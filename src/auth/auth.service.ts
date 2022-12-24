import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AccountService } from '../account';
import { Account, constant } from '../core';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccountWithGoogle(name: string, email: string, googleId: string) {
    const account = new Account();
    account.name = name;
    account.email = email;
    account.password = '';
    account.googleId = googleId;
    return await this.accountService.createAccount(account);
  }

  async createAccountWithFacebook(
    name: string,
    email: string,
    facebookId: string,
  ) {
    const account = new Account();
    account.name = name;
    account.email = email;
    account.password = '';
    account.facebookId = facebookId;
    return await this.accountService.createAccount(account);
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
}
