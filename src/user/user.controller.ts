import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200 })
    @ApiParam({ name: 'id', description: 'Id of the user' })
    async findOne(@Param() id: string): Promise<User> {
        return await this.userService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User successfully created', type: User })
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.create(createUserDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({ type: CreateUserDto })
    async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiBody({ type: CreateUserDto })
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        await this.userService.remove(id);
    }
}