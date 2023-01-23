import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './../auth.service';
import { Student, DatabaseService } from '../../core';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      clientID: configService.get<string>('google.clientID'),
      clientSecret: configService.get<string>('google.clientSecret'),
      callbackURL: `${configService.get<string>(
        'serverUrl',
      )}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(profile: Profile, done: VerifyCallback) {
    try {
      let account = await this.databaseService.getOneByField<Student>(
        Student,
        'googleId',
        profile.id,
      );
      if (!account) {
        account = await this.authService.createAccountWithOAuth(
          profile.displayName,
          profile._json.email,
          profile.id,
          'google',
        );
      }
      done(null, account);
    } catch (err) {
      done(err, null);
    }
  }
}
