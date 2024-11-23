import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const Token = createParamDecorator(
    (data: undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }



        try {
            const secretKey = process.env.JWT_SECRET_KEY;
            if (!secretKey) {
                throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
            }

            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    },
);