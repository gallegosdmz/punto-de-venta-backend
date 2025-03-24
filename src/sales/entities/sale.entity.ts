import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaleDetail } from "./sale-detail.entity";

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

    @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
    saleDetails: SaleDetail[];

    @Column({ default: false })
    isDeleted: boolean;
}
