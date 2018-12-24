import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'users/user.service';
import { AuthService } from 'auth/services/auth.service';
import { getResponse, CustomError } from 'shared/utils/utils';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}

    @Post('login')
    async login(@Body() loginData: {email: string}) {
        const error: CustomError = {
            err_stack: {}    
        };
        let token = '';
        // TODO: check all available errors during login operation and handle them
        const user = await this.userService
            .getUser(loginData)
            .then((user) => {
                if(!user) throw 'User is not found';
                return user
            })
            .catch(err => {
                error.err_stack.user_err = err
                return null;
            });
        
        if(user) {
            token = await this.authService.signIn({email: user.email})
            .catch(err => error.err_stack.token_err = err);    
        }
        
        return await getResponse(
            Object.keys(error.err_stack).length ? Promise.reject(error) : Promise.resolve({user, token}),
            'Login'
        )
    }
}
