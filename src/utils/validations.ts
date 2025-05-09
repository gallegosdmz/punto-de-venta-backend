import { DataSource, EntityTarget, Not } from "typeorm"
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Business } from "src/businesses/entities/business.entity";

@Injectable()
export class CustomValidator {
    constructor(
        private readonly dataSource: DataSource,
    ) {}

    // Recibe una entidad y email, y verifica si ese email ya está registrado
    async verifyEmailExist( entity: EntityTarget< any >, email: string ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        if ( !entity ) throw new BadRequestException('Entity is required');
        if ( !email ) throw new BadRequestException('Email is required'); 

        const entityDB = await queryRunner.manager.findOne( entity, {
            where: {
                email: email,
                isDeleted: false,
            },
        });
        
        if ( entityDB ) throw new BadRequestException('Email is already use');

        await queryRunner.release();
    }

    // Recibe una entidad, id, y email, verifica si el email enviado, es el mismo que el de la entidad que se quiere editar.
    async verifyEmailRepeat( entity: EntityTarget< any >, id: number, email: string ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        if ( !id ) throw new BadRequestException('Id is required');
        if ( !entity ) throw new BadRequestException('Entity is required');
        if ( !email ) throw new BadRequestException('Email is required');

        // Encontrar el id de la entidad que quieren editar
        const entityDB = await queryRunner.manager.findOne( entity, {
            where: {
                id,
                isDeleted: false,
            },
        });
        if ( !entityDB ) throw new NotFoundException(`${ entity } with id: ${ id } not found`); 

        // Buscar entity con el email que se quiere usar para editar
        const entityWithEmail = await queryRunner.manager.findOne( entity, {
            where: {
                email,
                isDeleted: false,
                id: Not( id ),
            },
        });
        if ( entityWithEmail && entityWithEmail.email === email ) throw new BadRequestException(`${ email } is busy`);
        
        await queryRunner.release();
    }

    async verifyNameExist( entity: EntityTarget<any>, name: string ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        if ( !name ) throw new BadRequestException('Name is required');

        const entityDB = await queryRunner.manager.findOne( entity, {
            where: {
                name,
                isDeleted: false,
            },
        });
        if ( entityDB ) throw new BadRequestException('Name is already use');

        await queryRunner.release();
    }

    async verifyNameRepeat( entity: EntityTarget<any>, id: number, name: string ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        if ( !id ) throw new BadRequestException('Id is required');
        if ( !name ) throw new BadRequestException('Email is required');

        // Encontrar el id de la entidad que quieren editar
        const entityDB = await queryRunner.manager.findOne( entity, {
            where: {
                id,
                isDeleted: false,
            },
        });
        if ( !entityDB ) throw new NotFoundException(`${ entity } with id: ${ id } not found`); 

        // Buscar entity con el name que se quiere usar para editar
        const entityWithName = await queryRunner.manager.findOne( entity, {
            where: {
                name,
                isDeleted: false,
                id: Not( id ),
            },
        });
        if ( entityWithName && entityWithName.name === name ) throw new BadRequestException(`${ name } is busy`);
        
        await queryRunner.release();
    }

    async verifyEntityExist( entity: EntityTarget<any>, id: number ) {
        if ( !entity ) throw new NotFoundException(`Entity is required`);
        if ( !id ) throw new NotFoundException(`Id is required`);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const entityDB = await queryRunner.manager.findOne( entity, {
            where: { id, isDeleted: false }
        });
        if ( !entityDB ) throw new NotFoundException(`${ entity } with id: ${ id } not found`);

        await queryRunner.release();

        return entityDB;
    }

    async verifyOwnerBusiness(business: number, user: User) {
        if (!business) throw new NotFoundException('Business is required');
        if (!user) throw new NotFoundException('User is required');

        const userObj = await this.verifyEntityExist(User, user.id);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const businessDB = await queryRunner.manager.findOne(Business, {
            where: { id: business, isDeleted: false },
        });
        if (!businessDB) throw new NotFoundException(`Business with id: ${ business } not found`);
        if (userObj.role === 'admin') return businessDB;

        if (!businessDB.users.includes(userObj)) throw new UnauthorizedException(`User: ${ userObj.userName } is unauthorized for access to Business selected`);

        await queryRunner.release();

        return businessDB;
    }

    async verifyUserNameExist(userName: string) {
        if (!userName) throw new NotFoundException('User Name is required');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await queryRunner.manager.findOne(User, {
            where: { userName, isDeleted: false },
        });
        if (user) throw new BadRequestException(`${ userName } is busy`);

        await queryRunner.release();
    }
}