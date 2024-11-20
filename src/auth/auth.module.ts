import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entity/user.entity';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt-strategy';
import { ConfigService } from '@nestjs/config';

dotenv.config();
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy, ConfigService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }