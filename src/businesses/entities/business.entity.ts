import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('businesses')
export class Business {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {length: 100, unique: true})
    name: string;

    @Column('varchar', {length: 254, unique: true})
    email: string;

    @OneToMany(() => User, (user) => user.business)
    users: User[];

    @Column({default: false})
    isDeleted: boolean;
}
