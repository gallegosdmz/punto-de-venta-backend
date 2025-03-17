import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories') 
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Column({ default: false })
    isDeleted: boolean;
}
