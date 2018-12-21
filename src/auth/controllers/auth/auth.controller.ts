import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'users/user.service';
import { AuthService } from 'auth/services/auth.service';
import { logger } from '../../../../logger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}

    @Post('login')
    async login(@Body() loginData: {email: string}) {
        const user = await this.userService.getUser(loginData);
        const token = await this.authService.signIn({email: user.email});
        logger.log(loginData.email, token);
    }

    @Post('proba')
    @UseGuards(AuthGuard())
    async proba() {
        return 'Eсть'
    }
}
