import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('policies')
export class Policy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    excerpt: string;

    @Column()
    category: string;

    @Column({ default: 'description' })
    icon: string;

    @Column({ default: false })
    published: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
