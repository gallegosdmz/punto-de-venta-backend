import { Business } from "src/businesses/entities/business.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories') 
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ManyToOne(() => Business)
    business: Business;

    @Column({ default: false })
    isDeleted: boolean;
}
