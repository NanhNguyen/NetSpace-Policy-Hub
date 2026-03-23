import { Role } from './role.entity';
export declare class Profile {
    id: string;
    email: string;
    full_name: string;
    role_id: number;
    created_at: Date;
    updated_at: Date;
    role: Role;
}
