import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Cryptofy Wallet API is Live! 🚀';
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
