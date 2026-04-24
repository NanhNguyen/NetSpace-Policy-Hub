import { Controller, Get, Query, Res, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LarkService } from './lark.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth/lark')
export class LarkController {
  private readonly logger = new Logger(LarkController.name);

  constructor(
    private readonly larkService: LarkService,
    private configService: ConfigService
  ) {}

  @Get('login')
  login(
    @Query('redirect') redirectPath: string, 
    @Query('appType') appType: 'internal' | 'external' = 'internal',
    @Query('state') state: string,
    @Res() res: Response
  ) {
    const isExternal = appType === 'external';
    const appId = isExternal 
      ? this.configService.get<string>('LARK_APP_ID_EXTERNAL')
      : this.configService.get<string>('LARK_APP_ID');

    if (!appId) {
       throw new HttpException('Lark config missing for type: ' + appType, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    let baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:4000';
    baseUrl = baseUrl.replace(/\/$/, '');
    const redirectUri = encodeURIComponent(`${baseUrl}/auth/lark/callback`);
    
    let stateObj: any = {};
    if (state) {
        try {
            stateObj = JSON.parse(state);
        } catch (e) {}
    }

    // Capture redirect from anywhere
    const finalRedirect = redirectPath || stateObj.redirect || '';
    stateObj.redirect = finalRedirect;
    stateObj.appType = appType;
    if (!stateObj.origin) {
        // Fallback origin if missing
        stateObj.origin = this.configService.get<string>('FRONTEND_URL') || 'https://chinhsach.ricasso.io.vn';
    }

    const stateStr = encodeURIComponent(JSON.stringify(stateObj));
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
        this.logger.log(`[LarkAuth V2] Magic link generated, redirecting user...`);
        return res.redirect(magicLink);
    } catch (e: any) {
        let frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        if (state) {
            try {
                const decodedState = JSON.parse(decodeURIComponent(state));
                if (decodedState.origin) {
                    frontendUrl = decodedState.origin;
                }
            } catch (err) {}
        }
        // Redirect to login page with error
        return res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(e.message || 'Unknown error')}`);
    }
  }
}
