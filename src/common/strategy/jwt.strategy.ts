import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { ConfigService } from "@nestjs/config";
import { AdminRepository } from "src/admin/repositories/admin.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
    private adminRepository: AdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    console.log(payload);

    // Check if the payload has an admin flag or field
    if (payload.isAdmin) {
      const admin = await this.adminRepository.findOneByEmail(payload.email);
      if (!admin || admin.status !== "ACTIVE") {
        throw new UnauthorizedException("Admin access denied");
      }
      return { ...admin, isAdmin: true }; // Attach admin role
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException("User access denied");
    }
    return { ...user, isAdmin: false }; // Attach user role
  }
}
