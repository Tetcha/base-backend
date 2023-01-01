import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  UsePipes,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  vRegisterRequestPayload,
  RegisterRequestPayload,
  LoginRequestPayload,
  vLoginRequestPayload,
} from './payloads/request';
import { constant, JoiValidatorPipe } from '../core';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: String, description: 'access token' })
  @UsePipes(new JoiValidatorPipe(vRegisterRequestPayload))
  async registerAccount(
    @Body() body: RegisterRequestPayload,
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.register(body);
    return res
      .cookie(constant.authController.tokenName, accessToken, {
        maxAge: constant.authController.registerCookieTime,
      })
      .send({ token: accessToken });
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ type: String, description: 'access token' })
  @UsePipes(new JoiValidatorPipe(vLoginRequestPayload))
  async cLogin(@Body() body: LoginRequestPayload, @Res() res: Response) {
    const accessToken = await this.authService.login(body);
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
