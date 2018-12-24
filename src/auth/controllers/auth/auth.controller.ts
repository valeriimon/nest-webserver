import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'users/user.service';
import { AuthService } from 'auth/services/auth.service';
import { getResponse, CustomError } from 'shared/utils/utils';
import { ValidationPipe } from 'shared/pipes/validation/validation.pipe';
import { User } from 'users/user.entity';


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
                if(!user) throw {message: 'User is not found'};
                return user
            })
            .catch(err => {
                error.err_stack.user_err = err.message;
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

    @Post('register')
    async register(@Body(new ValidationPipe(User)) body: User | Response) {
        if(!(body instanceof User)) {
            return body as Response
        }
        const error: CustomError = {
            err_stack: {}
        }
        let token = '';
        const user = await this.userService
            .createUser(body)
            .catch(err => error.err_stack.user_err = err.message);
        if(user) {
            token = await this.authService
                .signIn({email: user.email})
                .catch(err => error.err_stack.token_err = err.message);
        }
        

        return await getResponse(
            Object.keys(error.err_stack).length ? Promise.reject(error) : Promise.resolve({user, token}), 
            'Registration');
    }
}
