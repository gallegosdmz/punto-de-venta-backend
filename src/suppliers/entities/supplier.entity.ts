import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100, unique: true })
    name: string;

    @Column('varchar', { length: 150 })
    contact: string;

    @Column('varchar', { length: 20 })
    phone: string;

    @Column('varchar', { length: 254, unique: true })
    email: string;

    @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];

    @Column({ default: false })
    isDeleted: boolean;
}
