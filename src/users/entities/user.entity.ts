import { Business } from "src/businesses/entities/business.entity";
import { Product } from "src/products/entities/product.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Business, (business) => business.users)
    business: Business;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date;

    @Column({ default: false })
    isDeleted: boolean;
}
