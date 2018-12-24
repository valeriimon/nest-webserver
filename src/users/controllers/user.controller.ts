import { Controller, Post, Body, Get, Param, Query, Patch, UseGuards, Req, Put, UsePipes } from '@nestjs/common';
import { UserService } from 'users/user.service';
import { User } from 'users/user.entity';
import { ValidationPipe } from 'shared/pipes/validation/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { logger } from '../../../logger';
import { getResponse } from 'shared/utils/utils';
import { Roles, RolesGuard } from 'shared/guards/roles.guard';


@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
    constructor(
        private userService: UserService,
        ) { }
    
    @Post('create')
    @Roles('customer', 'admin')
    async createUser(@Body(new ValidationPipe(User)) body: User | Response) {
        if(!(body instanceof User)) {
            return body as Response
        }
        const result = this.userService.createUser(body)
        
        return await getResponse(result, 'Create user')
    }

    
    @Get('me')
    async getMe(@Req() req) {
        return await getResponse(Promise.resolve(req.user), 'Get me')
    }
    
    @Get('get/:id')
    async getUser(@Param() params: any) {
        const { id } = params;
        const result = this.userService.getUser({ id });

        return await getResponse(result, `Get user by id{${id}}`)

    }
    
    @Get('list')
    async userList(@Req() req, @Query() queryList: any) {
        const {limit, skip} = queryList;
        const result = this.userService.getUsers(skip, limit)
        logger.dir(req.authInfo);
        return await getResponse(result, 'Get users list')
    }
    
    @Patch('update/:id')
    @Roles('customer', 'admin')
    async updateUser(@Param() params: any, @Body() user: User) {
        const { id } = params;
        const result = this.userService.updateUser(id, user)
        
        return await getResponse(result, `Update user by id{${id}}`)
    }
}
