import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { TicketMessage } from './ticket-message.entity';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    employee_name: string;

    @Column()
    employee_email: string;

    @Column({ nullable: true })
    topic: string;

    @Column({ nullable: true })
    user_id: string;

    @Column('text')
    question: string;

    @Column('text', { nullable: true })
    answer: string;

    @Column({ default: 'open' })
    status: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    answered_at: Date;

    @OneToMany(() => TicketMessage, (message) => message.ticket)
    messages: TicketMessage[];
}
