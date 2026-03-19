import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Profile, (profile) => profile.role)
  profiles: Profile[];
}
