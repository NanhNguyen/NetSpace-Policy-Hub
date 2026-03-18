import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('push_subscriptions')
export class PushSubscriptionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('jsonb')
    subscription: any;

    @Column({ default: 'hr' })
    role: string;

    @CreateDateColumn()
    created_at: Date;
}
