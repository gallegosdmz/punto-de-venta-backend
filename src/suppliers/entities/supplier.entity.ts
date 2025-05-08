import { Business } from "src/businesses/entities/business.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Business)
    business: Business;

    @Column({ default: false })
    isDeleted: boolean;
}
