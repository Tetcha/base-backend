import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, DbModule } from './config';
import { AuthModule } from './auth';
import { AccountModule } from './account';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      load: [configuration],
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    AccountModule,
  ],
})
export class AppModule {}
