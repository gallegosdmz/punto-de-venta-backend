import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./sale.entity";
import { Product } from "src/products/entities/product.entity";

@Entity('sale_details')
export class SaleDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, (sale) => sale.saleDetails)
    sale: Sale;

    @ManyToOne(() => Product, (product) => product.saleDetails)
    product: Product;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2})
    unitPrice: number;

    @Column({ default: false })
    isDeleted: boolean;
}