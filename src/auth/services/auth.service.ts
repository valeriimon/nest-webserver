import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'auth/models/jwt-payload.model';
import { UserService } from 'users/user.service';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async signIn(data: JwtPayload) {
        return await this.jwtService.sign(data);
    }

    async validateUser(payload: JwtPayload) {
        const user = await this.userService.getUser({email: payload.email})
        if(!user) {
            return false
        }

        return user;
    }
}
