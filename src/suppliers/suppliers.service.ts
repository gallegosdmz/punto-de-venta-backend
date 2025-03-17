import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidations } from 'src/utils/validations';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository( Supplier )
    private readonly supplierRepository: Repository<Supplier>,
    private readonly customValidations: CustomValidations,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    await this.customValidations.verifyNameExist( Supplier, createSupplierDto.name );
    await this.customValidations.verifyEmailExist( Supplier, createSupplierDto.email );


    try {
      const supplier = this.supplierRepository.create( createSupplierDto );
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
      });

      return suppliers;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - suppliers' );
    }
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if ( !supplier ) throw new NotFoundException(`Supplier with id: ${ id } not found`);

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOne( id );
    await this.customValidations.verifyEmailRepeat( Supplier, id, updateSupplierDto.email! );
    await this.customValidations.verifyNameRepeat( Supplier, id, updateSupplierDto.name! );

    try {
      Object.assign( supplier, updateSupplierDto );
      await this.supplierRepository.save( supplier );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - suppliers' );
    }
  }

  async remove(id: number) {
    await this.findOne( id );

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
