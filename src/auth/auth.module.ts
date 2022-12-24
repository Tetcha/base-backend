import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../core';
import { AccountModule } from '../account';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    AccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>('jwt.expirationTime')}s`,
        },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
