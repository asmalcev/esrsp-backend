import {
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.session.user;

		if (!user) {
			return false;
		}

		const userRoleName = UserRole[user.role].toLowerCase();
		return roles.indexOf(userRoleName) > -1;
	}
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
