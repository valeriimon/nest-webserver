import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule) 
    ],
    providers: [UserService],
    controllers: [UserController],
    
    exports: [UserService],
})
export class UsersModule {}
