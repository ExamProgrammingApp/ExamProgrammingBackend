import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Student } from '../student/entity/student.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Teacher, Student])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }