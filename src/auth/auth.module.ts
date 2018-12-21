import { Module, forwardRef, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersModule } from 'users/user.module';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    forwardRef(() => UsersModule) 
  ],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {
}
