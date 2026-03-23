import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_messages')
export class TicketMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ticket_id: string;

    @Column('text')
    content: string;

    @Column()
    sender_type: 'employee' | 'hr';

    @Column({ nullable: true })
    sender_id: string;

    @Column({ nullable: true })
    sender_name: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne(() => Ticket, (ticket) => ticket.messages)
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;
}
