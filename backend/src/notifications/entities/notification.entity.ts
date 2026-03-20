import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @Column({ nullable: true })
    role: string; // 'HR', 'ADMIN', 'USER', etc.

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({ nullable: true })
    link: string;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;
}
