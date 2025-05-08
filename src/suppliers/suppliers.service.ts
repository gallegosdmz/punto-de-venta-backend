import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidator } from 'src/utils/validations';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository( Supplier )
    private readonly supplierRepository: Repository<Supplier>,
    private readonly customValidator: CustomValidator,
  ) {}

  async create(createSupplierDto: CreateSupplierDto, user: User) {
    await this.customValidator.verifyNameExist( Supplier, createSupplierDto.name );
    await this.customValidator.verifyEmailExist( Supplier, createSupplierDto.email );

    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const supplier = this.supplierRepository.create({
        ...createSupplierDto,
        business,
      });
      await this.supplierRepository.save( supplier );

      return supplier;

    } catch ( error ) {
      handleDBErrors( error, 'create - supplier' );
    }
  }

  async findAll() {
    try {
      const suppliers = await this.supplierRepository.find({
        where: {
          isDeleted: false,
        },
        relations: {
          business: true,
          products: true,
        }
      });

      return suppliers;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - suppliers' );
    }
  }

  async findAllByBusiness(user: User) {
    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const suppliers = await this.supplierRepository.find({
        where: {
          isDeleted: false,
          business,
        },
        relations: {
          products: true,
        },
      });

      return suppliers;

    } catch (error) {
      handleDBErrors(error, 'findAllByBusiness - suppliers');
    }
  }

  async findOne(id: number, user: User) {
    const supplier = await this.supplierRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if ( !supplier ) throw new NotFoundException(`Supplier with id: ${ id } not found`);
    await this.customValidator.verifyOwnerBusiness(supplier.business.id, user);

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto, user: User) {
    const supplier = await this.findOne(id, user);
    await this.customValidator.verifyEmailRepeat( Supplier, id, updateSupplierDto.email! );
    await this.customValidator.verifyNameRepeat( Supplier, id, updateSupplierDto.name! );

    try {
      const updatedSupplier = this.supplierRepository.create({
        ...supplier,
        ...updateSupplierDto
      })
      await this.supplierRepository.save( updatedSupplier );

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'update - suppliers' );
    }
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);

    try {
      await this.supplierRepository.update( id, { isDeleted: true } );

      return {
        message: `Supplier with id: ${ id } is removed successfully`
      }
      
    } catch ( error ) {
      handleDBErrors( error, 'remove - suppliers' );
    }
  }
}
