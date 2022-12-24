import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AccountService } from '../../account';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
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
      let account = await this.accountService.getAccountByFacebookId(id);
      if (!account) {
        account = await this.authService.createAccountWithFacebook(
          name.givenName,
          emails[0].value,
          id,
        );
      }
      done(null, account);
    } catch (err) {
      done(err, null);
    }
  }
}
