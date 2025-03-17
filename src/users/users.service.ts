import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { handleDBErrors } from 'src/utils/errors';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create( createUserDto: CreateUserDto ) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      await this.userRepository.save( user );

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch ( error ) {
      handleDBErrors( error, 'create - user' );
    }
  }

  async login( loginUserDto: LoginUserDto ) {
    const { password, userName } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { userName },
      select: { userName: true, password: true, id: true },
    });

    if ( !user ) throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !bcrypt.compareSync( password, user.password ) ) throw new UnauthorizedException('Credentials are not valid (password)');

    const { password: _, ...userLogged } = user;

    return {
      ...userLogged,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus( user: User ) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        where: {
          isDeleted: false,
        },
      });


      return users.map(({ password, ...user }) => user );

    } catch ( error ) {
      handleDBErrors( error, 'findAll - users' );
    }
  }

  async findOne(id: number) {
    const userDB = await this.userRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if ( !userDB ) throw new NotFoundException(`User with id: ${ id } not found`);

    const { password, ...user } = userDB;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne( id );

    try {
      Object.assign( user, updateUserDto );
      await this.userRepository.save( user );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - users' );
    }
  }

  async changePassword( id: number, changePasswordDto: ChangePasswordDto ) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
      select: { userName: true, password: true, id: true },
    });
    if ( !user ) throw new NotFoundException(`User with id: ${ id } not found`);

    try {
      const newPassword = bcrypt.hashSync( changePasswordDto.password, 10);

      await this.userRepository.update( id, { password: newPassword });

      return {
        message: 'Password update successfuly',
      }

    } catch ( error ) {
      handleDBErrors( error, 'changuePassword - users ');
    }
  }

  async remove(id: number) {
    await this.findOne( id );

    try {
      await this.userRepository.update( id, { isDeleted: true } );

      return {
        message: `User with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - users' );
    }
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }
}
