import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, LogoutDto, MfaSetupDto, MfaVerifyDto, RefreshDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signup(@Body() body: SignUpDto, @Req() req: any) {
    return this.authService.signUp({
      email: body.email,
      password: body.password,
      name: body.name,
      deviceId: body.deviceId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async login(@Body() body: LoginDto, @Req() req: any) {
    return this.authService.login({
      email: body.email,
      password: body.password,
      deviceId: body.deviceId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async refresh(@Body() body: RefreshDto, @Req() req: any) {
    return this.authService.refresh({
      refreshToken: body.refreshToken,
      deviceId: body.deviceId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() body: LogoutDto, @CurrentUser() user: any) {
    return this.authService.logout({ userId: user.sub, deviceId: body.deviceId });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.authService.getUser(user.sub);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  async mfaSetup(@Body() _body: MfaSetupDto, @CurrentUser() user: any) {
    return this.authService.mfaSetup(user.sub);
  }

  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  async mfaEnable(@Body() body: MfaVerifyDto, @CurrentUser() user: any) {
    return this.authService.mfaVerifyEnable(user.sub, body.code);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}
