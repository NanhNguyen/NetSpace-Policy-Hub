import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { LarkService } from './lark.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth/lark')
export class LarkController {
  constructor(
    private readonly larkService: LarkService,
    private configService: ConfigService
  ) {}

  @Get('login')
  login(@Query('redirect') redirectPath: string, @Res() res: Response) {
    const appId = this.configService.get<string>('LARK_APP_ID');
    if (!appId) {
       throw new HttpException('Lark config missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // In production, you might want to use the actual registered domain.
    let baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:4000';
    baseUrl = baseUrl.replace(/\/$/, '');
    const redirectUri = encodeURIComponent(`${baseUrl}/auth/lark/callback`);
    
    // Pass state to persist redirect handling after login
    const stateObj = { 
        redirect: redirectPath || ''
    };
    const stateStr = encodeURIComponent(JSON.stringify(stateObj));

    // Use the standard Lark OAuth v1/index endpoint
    const larkAuthUrl = `https://open.larksuite.com/open-apis/authen/v1/index?app_id=${appId}&redirect_uri=${redirectUri}&state=${stateStr}`;
    return res.redirect(larkAuthUrl);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    if (!code) {
      throw new HttpException('Missing authorization code', HttpStatus.BAD_REQUEST);
    }

    try {
        const magicLink = await this.larkService.processLarkCallback(code, state);
        return res.redirect(magicLink);
    } catch (e: any) {
        // Redirect to login page with error
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(e.message || 'Unknown error')}`);
    }
  }
}
