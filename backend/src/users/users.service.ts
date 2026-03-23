import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UsersService {
  private supabaseAdmin: SupabaseClient;

  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && serviceRoleKey) {
      this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }

  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profilesRepository.find({
      relations: ['role'],
      order: { created_at: 'DESC' },
    });
  }

  async getProfile(id: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async createUser(data: { email: string; full_name: string; role_id: number; password?: string }) {
    if (!this.supabaseAdmin) {
      throw new InternalServerErrorException('Supabase Admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY.');
    }

    // 1. Create User in Supabase Auth
    const { data: authUser, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password || '123456',
      email_confirm: true,
      user_metadata: { 
        full_name: data.full_name,
        role_id: data.role_id
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new ConflictException('Email đã tồn tại trên hệ thống Auth');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const userId = authUser.user.id;

    // 2. Create Profile in our DB (if trigger didn't do it)
    try {
      const profile = this.profilesRepository.create({
        id: userId,
        email: data.email,
        full_name: data.full_name,
        role_id: data.role_id,
      });
      return await this.profilesRepository.save(profile);
    } catch (error) {
       // If it fails here, maybe it already exists via trigger?
       return await this.getProfile(userId);
    }
  }

  async updateRole(userId: string, roleId: number) {
    const profile = await this.profilesRepository.findOneBy({ id: userId });
    if (!profile) throw new NotFoundException('Profile not found');

    profile.role_id = roleId;

    // Update role in Supabase Auth Metadata as well (for fast path auth)
    if (this.supabaseAdmin) {
      const role = await this.rolesRepository.findOneBy({ id: roleId });
      if (role) {
        await this.supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { role: role.code, role_id: roleId }
        });
      }
    }

    return await this.profilesRepository.save(profile);
  }

  async updateProfile(userId: string, data: { email: string; full_name: string; role_id: number }) {
    const profile = await this.profilesRepository.findOneBy({ id: userId });
    if (!profile) throw new NotFoundException('Profile not found');

    profile.email = data.email;
    profile.full_name = data.full_name;
    profile.role_id = data.role_id;

    // Sync with Supabase Auth
    if (this.supabaseAdmin) {
      const role = await this.rolesRepository.findOneBy({ id: data.role_id });
      await this.supabaseAdmin.auth.admin.updateUserById(userId, {
        email: data.email,
        user_metadata: { 
          full_name: data.full_name, 
          role: role?.code || 'USER',
          role_id: data.role_id 
        }
      });
    }

    return await this.profilesRepository.save(profile);
  }

  async updateAdminPassword(userId: string, newPassword: string) {
    if (!this.supabaseAdmin) {
      throw new InternalServerErrorException('Supabase Admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY.');
    }

    const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { message: 'Password updated successfully' };
  }
}
