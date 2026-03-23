import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';
export declare class UsersService {
    private profilesRepository;
    private rolesRepository;
    private configService;
    private supabaseAdmin;
    constructor(profilesRepository: Repository<Profile>, rolesRepository: Repository<Role>, configService: ConfigService);
    getAllRoles(): Promise<Role[]>;
    getAllProfiles(): Promise<Profile[]>;
    getProfile(id: string): Promise<Profile>;
    createUser(data: {
        email: string;
        full_name: string;
        role_id: number;
        password?: string;
    }): Promise<Profile>;
    updateRole(userId: string, roleId: number): Promise<Profile>;
    updateProfile(userId: string, data: {
        email: string;
        full_name: string;
        role_id: number;
    }): Promise<Profile>;
    updateAdminPassword(userId: string, newPassword: string): Promise<{
        message: string;
    }>;
}
