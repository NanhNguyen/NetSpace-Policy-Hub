import { Role } from './role.entity';
export declare class Profile {
    id: string;
    email: string;
    full_name: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
}
