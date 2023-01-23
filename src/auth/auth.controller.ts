import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { constant } from '../core';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ type: String, description: 'access token' })
  async cLogin(@Res() res: Response) {
    const accessToken = await this.authService.login();
    return res
      .cookie(constant.authController.tokenName, accessToken, {
        maxAge: constant.authController.loginCookieTime,
      })
      .send({ token: accessToken });
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout user account' })
  async cLogout(@Res() res: Response) {
    return res
      .cookie(constant.authController.tokenName, '', { maxAge: -999 })
      .send();
  }

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
