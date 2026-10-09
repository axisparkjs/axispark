import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class AuditRecord {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    _id: number;

    @Column()
    action: string;

    @Column()
    subject: string;

    @CreateDateColumn()
    createdAt: Date;
}
