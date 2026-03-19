"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const profile_entity_1 = require("./entities/profile.entity");
const role_entity_1 = require("./entities/role.entity");
let UsersService = class UsersService {
    profilesRepository;
    rolesRepository;
    configService;
    supabaseAdmin;
    constructor(profilesRepository, rolesRepository, configService) {
        this.profilesRepository = profilesRepository;
        this.rolesRepository = rolesRepository;
        this.configService = configService;
        const supabaseUrl = this.configService.get('NEXT_PUBLIC_SUPABASE_URL');
        const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (supabaseUrl && serviceRoleKey) {
            this.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            });
        }
    }
    async getAllRoles() {
        return this.rolesRepository.find();
    }
    async getAllProfiles() {
        return this.profilesRepository.find({
            relations: ['role'],
            order: { createdAt: 'DESC' },
        });
    }
    async getProfile(id) {
        const profile = await this.profilesRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        return profile;
    }
    async createUser(data) {
        if (!this.supabaseAdmin) {
            throw new common_1.InternalServerErrorException('Supabase Admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY.');
        }
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
                throw new common_1.ConflictException('Email đã tồn tại trên hệ thống Auth');
            }
            throw new common_1.InternalServerErrorException(authError.message);
        }
        const userId = authUser.user.id;
        try {
            const profile = this.profilesRepository.create({
                id: userId,
                email: data.email,
                full_name: data.full_name,
                roleId: data.role_id,
            });
            return await this.profilesRepository.save(profile);
        }
        catch (error) {
            return await this.getProfile(userId);
        }
    }
    async updateRole(userId, roleId) {
        const profile = await this.profilesRepository.findOneBy({ id: userId });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        profile.roleId = roleId;
        return await this.profilesRepository.save(profile);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map