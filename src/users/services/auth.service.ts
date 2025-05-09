import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../dto/login-user.dto";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { handleDBErrors } from "src/utils/errors";
import { CreateUserDto } from "../dto/create-user.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { BusinessValidator } from "src/businesses/validators/business.validator";

export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly businessValidator: BusinessValidator,
    ) {}

    async create(createUserDto: CreateUserDto, business: number, user: User) {
        const {password, ...userData} = createUserDto;
        const businessObj = await this.businessValidator.verifyOwnerBusiness(business, user);
        await this.businessValidator.verifyFieldNotRepeated(User, 'userName', createUserDto.userName);
    
        try {
          const userCreated = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync(password, 10),
            business: businessObj
          });
          await this.userRepository.save(user);

          const {password: _, ...userToReturn} = userCreated;

          return {
            ...userToReturn,
            token: this.getJwtToken({ id: user.id }),
          }
    
        } catch (error) {
          handleDBErrors(error, 'create private - users');
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

    async changePassword( id: number, changePasswordDto: ChangePasswordDto, user: User ) {
        const userObj = await this.userRepository.findOne({
          where: { id, isDeleted: false },
          select: { userName: true, password: true, id: true },
          relations: {
            business: true,
          },
        });
        if (!userObj) throw new NotFoundException(`User with id: ${ id } not found`);
        await this.businessValidator.verifyOwnerBusiness(userObj.business.id, user);
    
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

    private getJwtToken( payload: JwtPayload ) {
        const token = this.jwtService.sign( payload );
        return token;
    }
}