import { Category } from "src/categories/entities/category.entity";
import { SaleDetail } from "src/sales/entities/sale-detail.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2 })
    purchasePrice: number;

    @Column('text')
    barCode: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @ManyToOne(() => User, (user) => user.products)
    user: User;

    @ManyToOne(() => Supplier, (supplier) => supplier.products)
    supplier: Supplier;

    @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
    saleDetails: SaleDetail[];

    @Column({ default: false })
    isDeleted: boolean;
}
