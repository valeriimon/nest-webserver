import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "auth/services/auth.service";
import { JwtPayload } from "auth/models/jwt-payload.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secretKey'
        });
    }

    async validate(payload: JwtPayload, done) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            done(new UnauthorizedException(), false)
        }
        
        done(null, user);
    }
}