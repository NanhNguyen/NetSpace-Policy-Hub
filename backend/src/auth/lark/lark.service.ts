import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LarkService {
  private readonly supabaseAdmin: SupabaseClient;
  private readonly logger = new Logger(LarkService.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || 
                        this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && serviceRoleKey) {
        this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        });
    }
  }

  async getAppAccessToken(appType: 'internal' | 'external' = 'internal'): Promise<string> {
    const isExternal = appType === 'external';
    const appId = isExternal 
      ? this.configService.get<string>('LARK_APP_ID_EXTERNAL')
      : this.configService.get<string>('LARK_APP_ID');
    const appSecret = isExternal
      ? this.configService.get<string>('LARK_APP_SECRET_EXTERNAL')
      : this.configService.get<string>('LARK_APP_SECRET');
    
    try {
        const res = await axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
        app_id: appId,
        app_secret: appSecret,
        });
        return res.data.app_access_token;
    } catch (e: any) {
        this.logger.error(`Failed to get Lark app access token for ${appType}`);
        throw new HttpException(`Failed to authenticate with Lark (${appType})`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserAccessToken(code: string, appType: 'internal' | 'external' = 'internal'): Promise<string> {
    const appToken = await this.getAppAccessToken(appType);
    try {
        const res = await axios.post('https://open.larksuite.com/open-apis/authen/v1/oidc/access_token', {
        grant_type: 'authorization_code',
        code,
        }, {
        headers: {
            Authorization: `Bearer ${appToken}`
        }
        });

        // The token is actually inside res.data.data.access_token if successful
        if (res.data.code !== 0) {
           throw new Error(`Lark error code: ${res.data.code}`);
        }

        return res.data.data.access_token;
    } catch(e: any) {
         this.logger.error("Failed to get User access token from code", e.message);
         throw new HttpException('Failed to get user access token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserInfo(userAccessToken: string) {
    try {
        const res = await axios.get('https://open.larksuite.com/open-apis/authen/v1/user_info', {
        headers: {
            Authorization: `Bearer ${userAccessToken}`
        }
        });

        return res.data.data;
    } catch(e: any) {
         this.logger.error("Failed to get user info from Lark", e.message);
         throw new HttpException('Failed to get user info', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processLarkCallback(code: string, state: string) {
    if (!this.supabaseAdmin) {
        this.logger.error("Supabase Admin Client NOT initialized");
        throw new HttpException("Supabase not configured in backend", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.logger.log(`Processing callback with code: ${code?.substring(0, 5)}...`);
    
    let appType: 'internal' | 'external' = 'internal';
    let redirectPath = '';
    
    if (state) {
        try {
            const decodedState = JSON.parse(decodeURIComponent(state));
            appType = decodedState.appType || 'internal';
            redirectPath = decodedState.redirect || '';
        } catch(e) {}
    }

    const userToken = await this.getUserAccessToken(code, appType);
    const userInfo = await this.getUserInfo(userToken);
    
    this.logger.log(`Lark User Info retrieved: ${JSON.stringify(userInfo)}`);

    // Fallbacks since enterprise_email might be missing depending on scopes
    const email = userInfo.enterprise_email || userInfo.email || userInfo.mobile; // Added mobile as a last resort fallback
    
    if (!email) {
      this.logger.error("No email or info found in Lark user profile");
      throw new HttpException('Lark account must have an associated email address or mobile', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`Attempting to generate magic link for email: ${email}`);

    let redirectUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    if (redirectPath) {
        const base = redirectUrl.replace(/\/$/, "");
        const path = redirectPath.replace(/^\//, "");
        redirectUrl = `${base}/${path}`;
    }

    this.logger.log(`Final redirect URL after login will be: ${redirectUrl}`);

    const { data: linkData, error: linkError } = await this.supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.includes('@') ? email : `${email}@lark.internal`, // Dummy email if it's a mobile number
      options: {
          redirectTo: redirectUrl,     
          data: {
              full_name: userInfo.name || userInfo.en_name,
              avatar_url: userInfo.avatar_url
          }
      }
    });

    if (linkError) {
        this.logger.error(`Supabase generateLink error: ${linkError.message}`);
        throw new HttpException('Failed to authenticate via Supabase: ' + linkError.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`Magic link generated successfully. Redirecting user to Supabase verification...`);
    return linkData.properties.action_link;
  }
}
