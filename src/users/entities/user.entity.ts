import { Product } from "src/products/entities/product.entity";
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

    @Column({ default: false })
    isDeleted: boolean;
}
