import { CanActivate, ExecutionContext, Injectable, ReflectMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector: Reflector) { }
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if(!roles || (roles && !roles.length)) {
      return true
    }

    const req = context.switchToHttp().getRequest();
    
    const user = req.user;
    return user && roles.indexOf(user.role) > -1;
  }
}
