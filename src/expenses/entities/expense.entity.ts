import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 150 })
    concept: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ default: false })
    isDeleted: boolean;
}