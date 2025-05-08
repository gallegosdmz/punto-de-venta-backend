import { Business } from "src/businesses/entities/business.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 150 })
    concept: string;

    @Column('varchar', {length: 150})
    expCategory: string;

    @Column('varchar', {length: 150})
    method: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => Business)
    business: Business;

    @Column({ default: false })
    isDeleted: boolean;
}