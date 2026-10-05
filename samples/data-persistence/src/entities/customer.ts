import { Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    _id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column('integer')
    age: number;

    @CreateDateColumn()
    createdAt: Date;
}
