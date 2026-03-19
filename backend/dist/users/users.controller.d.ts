import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllRoles(): Promise<import("./entities/role.entity").Role[]>;
    getAllProfiles(): Promise<import("./entities/profile.entity").Profile[]>;
    getProfile(id: string): Promise<import("./entities/profile.entity").Profile>;
    createUser(data: {
        email: string;
        full_name: string;
        role_id: number;
        password?: string;
    }): Promise<import("./entities/profile.entity").Profile>;
    updateRole(id: string, roleId: number): Promise<import("./entities/profile.entity").Profile>;
}
