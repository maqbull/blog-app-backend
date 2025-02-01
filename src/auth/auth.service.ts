import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity' // Adjust the import based on your User entity path

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async validateOAuthUser(profile: any, provider: 'google' | 'facebook') {
    const email = profile.emails[0].value;

    // Try to find existing user
    let user = await this.userRepository.findOne({ where: { email } });

    // If user doesn't exist, create new user
    if (!user) {
      user = await this.userRepository.save({
        email,
        name: profile.displayName,
        provider,
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }
} 