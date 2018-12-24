import { NestMiddleware, MiddlewareFunction, Injectable, HttpException } from "@nestjs/common";
import * as passport from 'passport';
import { User } from "users/user.entity";

interface PassportCbPayload {
    err: any,
    user: User,
    info: any
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async resolve(...args: any[]): Promise<MiddlewareFunction> {
        /*
            Functional based @nest/passport source code
            link: https://github.com/nestjs/passport/blob/master/lib/auth.guard.ts
        */
        const passportAuth = (req, res): Promise<PassportCbPayload> => new Promise((resolve, reject) => {
            passport.authenticate('jwt', (err, user, info) => {
                resolve({err, user, info})
            })(req, res, err => (err ? reject(err) : resolve));
        })

        return async (req, res, next) => {
            const result = await passportAuth(req, res);
            if(result.info && result.info.name === 'TokenExpiredError') {
                throw new HttpException({
                    name: result.info.name,
                    message: result.info.message,
                    expiredAt: result.info.expiredAt
                }, 401);
            }

            req.authInfo = result;
            next();
        }
    }
}