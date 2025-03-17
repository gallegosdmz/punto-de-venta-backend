import { Category } from "src/categories/entities/category.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ default: false })
    isDeleted: boolean;
}
