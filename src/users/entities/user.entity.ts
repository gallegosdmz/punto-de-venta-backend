import { Product } from "src/products/entities/product.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { length: 100, unique: true })
    userName: string;

    @Column('varchar', { length: 254 })
    password: string;

    @Column('varchar', { length: 50, default: 'Cajero' })
    role: string;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[];

    @Column({ default: false })
    isDeleted: boolean;
}
