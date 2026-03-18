import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    question: string;

    @Column('text')
    answer: string;

    @Column()
    category: string;

    @Column({ default: 0 })
    order_index: number;

    @Column({ default: true })
    published: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
