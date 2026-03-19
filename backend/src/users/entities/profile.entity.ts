import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('profiles')
export class Profile {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ name: 'role_id', default: 4 })
  roleId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.profiles)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
