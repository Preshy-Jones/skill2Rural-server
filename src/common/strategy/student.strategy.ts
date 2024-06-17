import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class StudentStrategy extends PassportStrategy(Strategy, "student") {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const data = await this.authService.validateStudent(email, password);

    if (!data) {
      throw new UnauthorizedException();
    }

    return data;
  }
}
