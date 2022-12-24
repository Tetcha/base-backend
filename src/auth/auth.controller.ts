import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------------------3rd authentication---------------------------
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    //
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleOAuthCallBack(req, res);
  }

  @Get()
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    //
  }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleOAuthCallBack(req, res);
  }
}
