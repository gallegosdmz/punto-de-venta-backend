import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { AuthService } from './auth.service';
import { BusinessValidator } from 'src/businesses/validators/business.validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly businessValidator: BusinessValidator,
  ) {}

  async create(createUserDto: CreateUserDto, user: User) {
    const data = await this.authService.create(createUserDto, user.business.id, user);
    return data;
  }

  async findAll(user: User) {
    const business = await this.businessValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const users = await this.userRepository.find({
        where: {
          isDeleted: false,
          business,
        },
        relations: {
          sales: true,
        },
      });

      return users.map(({ password, ...user }) => user );

    } catch (error) {
      handleDBErrors(error, 'findAllByBusiness - users');
    }
  }

  async findOne(id: number, user: User) {
    const userDB = await this.userRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if ( !userDB ) throw new NotFoundException(`User with id: ${ id } not found`);
    await this.businessValidator.verifyOwnerBusiness(userDB.business.id, user);

    const { password, ...data } = userDB;

    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const userToUpdate = await this.findOne(id, user);

    try {
      const userUpdated = this.userRepository.create({
        ...userToUpdate,
        ...updateUserDto,
        business: userToUpdate.business,
      });
      await this.userRepository.save( userUpdated );

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'updateUserInBusiness - users' );
    }
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);

    try {
      await this.userRepository.update( id, { isDeleted: true } );

      return {
        message: `User with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - users' );
    }
  }

}
