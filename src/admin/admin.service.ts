import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminRepository } from "./repositories/admin.repository";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}
  async create(createAdminDto: CreateAdminDto) {
    return "This action adds a new admin";
  }

  async login(LoginAdminDto: LoginAdminDto) {}

  async createCourse() {
    return "This action adds a new course";
  }

  async createQuestion() {
    return "This action adds a new question";
  }

  async findByEmail(email: string) {
    return this.adminRepository.findOneByEmail(email);
  }
}
