import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
// export class AdminAuthGuard extends AuthGuard("admin") {}
export class AdminAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const path = request.url; // This gives you the route path
    console.log(`Current route path: ${path}`);
    if (path === '/admin/login') {
      return true;
    }
    // Ensure the user is an admin
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException("Admin privileges required");
    }

    return true;
  }
}
