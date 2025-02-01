import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategies/google.strategy'
import { FacebookStrategy } from './strategies/facebook.strategy'
import { User } from '../users/user.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, GoogleStrategy, FacebookStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { } 