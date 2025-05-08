import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaleDetail } from "./sale-detail.entity";
import { Business } from "src/businesses/entities/business.entity";

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('date')
    dateSale: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => User, (user) => user.sales)
    user: User;

    @Column('varchar', {length: 150})
    client: string;

    @Column('varchar', {length: 150})
    method: string; // Tarjeta, Transferencia, Efectivo

    @Column({default: true})
    status: boolean; // true: completada, false: cancelada

    @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
    saleDetails: SaleDetail[];

    @ManyToOne(() => Business)
    business: Business;

    @Column({ default: false })
    isDeleted: boolean;
}
