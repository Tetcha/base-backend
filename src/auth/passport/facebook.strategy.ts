import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Account, DatabaseService } from '../../core';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      clientID: configService.get<string>('facebook.clientID'),
      clientSecret: configService.get<string>('facebook.clientSecret'),
      callbackURL: `${configService.get<string>(
        'serverUrl',
      )}/auth/facebook/callback`,
      scope: configService.get<string>('facebook.scope'),
      profileFields: ['emails', 'name', 'displayName', 'gender', 'profileUrl'],
    });
  }

  async validate(
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, id } = profile;
    try {
      let account = await this.databaseService.getOneByField<Account>(
        Account,
        'facebookId',
        id,
      );
      if (!account) {
        account = await this.authService.createAccountWithOAuth(
          name.givenName,
          emails[0].value,
          id,
          'facebook',
        );
      }
      done(null, account);
    } catch (err) {
      done(err, null);
    }
  }
}
