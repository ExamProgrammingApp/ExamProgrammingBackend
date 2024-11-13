import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const existUser = await this.userRepository.findOne({
            where: { userId: id },
            select: ['userId', 'name', 'email', 'role'],
        });
        if (!existUser) {
            throw new NotFoundException('User not found');
        }

        return existUser
    }

    async create(user: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return this.userRepository.save({ ...user, password: hashedPassword });
    }

    async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }
}