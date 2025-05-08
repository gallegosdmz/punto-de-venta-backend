import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidator } from 'src/utils/validations';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly CustomValidator: CustomValidator,
  ) {}

  async create(createBusinessDto: CreateBusinessDto) {
    await this.CustomValidator.verifyEmailExist(Business, createBusinessDto.email);
    
    try {
      const business = this.businessRepository.create(createBusinessDto);
      await this.businessRepository.save(business);
      
      return business;

    } catch (error) {
      handleDBErrors(error, 'create - business');
    }
  }

  async findAll() {
    const businesses = await this.businessRepository.find({
      where: {
        isDeleted: false,
      },
      relations: {
        users: true,
      }
    });

    return businesses;
  }

  async findOne(id: number) {
    const business = await this.businessRepository.findOne({
      where: { id, isDeleted: false },
      relations: {
        users: true,
      },
    });
    if (!business) throw new NotFoundException(`Business with id: ${ id } not found`);

    return business;
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.findOne(id);

    await this.CustomValidator.verifyEmailRepeat(Business, id, updateBusinessDto.email!);

    try {
      const updatedBusiness = this.businessRepository.create({
        ...business,
        ...updateBusinessDto,
      })
      await this.businessRepository.save(updatedBusiness);
      
      return this.findOne(id);

    } catch (error) {
      handleDBErrors(error, 'update - businesses');
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.businessRepository.update(id, { isDeleted: true });

      return {
        message: `Business with id: ${ id } is removed successfully`
      };

    } catch (error) {
      handleDBErrors(error, 'remove - businesses');
    }
  }
}
