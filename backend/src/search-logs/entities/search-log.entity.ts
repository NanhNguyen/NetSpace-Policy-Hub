import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('search_logs')
export class SearchLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    query: string;

    @Column({ default: 0 })
    result_count: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
