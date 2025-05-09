import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { BusinessValidator } from "src/businesses/validators/business.validator";
import { CreateUserDto } from "../dto/create-user.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { handleDBErrors } from "src/utils/errors";
import { UpdateUserDto } from "../dto/update-user.dto";

export class AdmininistratorsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
    ) {}

    async create(createUserDto: CreateUserDto, user: User) {
      const {businessId, ...dtoUser} = createUserDto;

       if (!businessId) throw new BadRequestException('Business Id is required');

       const data = await this.authService.create(dtoUser, businessId, user);
       return data;
    }

    async findAll() {
        try {
          const users = await this.userRepository.find({
            where: {
              isDeleted: false,
            },
            relations: {
              business: true,
              products: true,
              sales: true,
            },
          });
    
          return users.map(({ password, ...user }) => user );
    
        } catch ( error ) {
          handleDBErrors( error, 'findAll - users' );
        }
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
                isDeleted: false,
            },
            relations: {
                business: true,
                products: true,
                sales: true,
            },
        });
        if (!user) throw new NotFoundException(`User with id: ${ id } not found`);

        const {password, ...data} = user;

        return data;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const userToUpdate = await this.findOne(id);
    
        try {
          const userUpdated = this.userRepository.create({
            ...userToUpdate,
            ...updateUserDto,
          });
          await this.userRepository.save(userUpdated);
    
          return userUpdated;
    
        } catch (error) {
          handleDBErrors(error, 'updateUserCeo - users');
        }
    }

    async remove(id: number) {
        await this.findOne(id);

        try {
            await this.userRepository.update(id, { isDeleted: true });

            return {
                message: `User with id: ${ id } is removed successfully`
            }

        } catch (error) {
            handleDBErrors(error, 'remove - administratos');
        }
    }
}