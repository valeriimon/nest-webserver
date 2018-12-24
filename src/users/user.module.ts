import { Module, forwardRef, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'auth/auth.module';
import { AuthMiddleware } from 'auth/auth.middleware';
import { JwtStrategy } from 'auth/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule) 
    ],
    providers: [UserService],
    controllers: [UserController],
    
    exports: [UserService],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware)
            .exclude(
                {path: 'users/list', method: RequestMethod.GET},
                {path: 'users/create', method: RequestMethod.POST}
            )
            .forRoutes('users/*')
            
    }
}
