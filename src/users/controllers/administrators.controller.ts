import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { AdmininistratorsService } from "../services/administrators.service";
import { Auth } from "../decorators/auth.decorator";
import { ValidRoles } from "../interfaces/valid-roles";
import { CreateUserDto } from "../dto/create-user.dto";
import { GetUser } from "../decorators/get-user.decorator";
import { User } from "../entities/user.entity";
import { UpdateUserDto } from "../dto/update-user.dto";

@Controller('administrators')
export class AdmininistratorsController {
    constructor(private readonly administratorsService: AdmininistratorsService) {}

    @Post()
    @Auth(ValidRoles.administrator)
    create(
        @Body() createUserDto: CreateUserDto,
        @GetUser() user: User
    ) {
        return this.administratorsService.create(createUserDto, user);
    }

    @Get()
    @Auth(ValidRoles.administrator)
    findAll() {
        return this.administratorsService.findAll();
    }

    @Get(':id')
    @Auth(ValidRoles.administrator)
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.administratorsService.findOne(+id);
    }

    @Patch(':id')
    @Auth(ValidRoles.administrator)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.administratorsService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.administrator)
    remove(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.administratorsService.remove(+id);
    }
}