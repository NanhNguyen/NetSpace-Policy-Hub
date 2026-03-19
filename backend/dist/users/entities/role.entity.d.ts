import { Profile } from './profile.entity';
export declare class Role {
    id: number;
    code: string;
    name: string;
    profiles: Profile[];
}
