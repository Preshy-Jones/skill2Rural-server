import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AdminService } from "src/admin/admin.service";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {


    const data = await this.authService.validateAdmin(email, password);

    if (!data) {
      throw new UnauthorizedException();
    }

    return data;
  }
}
