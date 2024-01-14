import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { loginDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { registerDto } from "./dto/register-user.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users } from "../users/users.model";
import { UserService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(loginDto: loginDto): Promise<any> {
    const { username, password } = loginDto;

    try {
      if (!username || !password) {
        throw new BadRequestException('Username and password are required.');
      }

      const user = await this.prismaService.users.findFirst({
        where: { username },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const validatePassword = await bcrypt.compare(password, user.password);

      if (!validatePassword) {
        // Throw a custom UnauthorizedException for invalid password
        throw new UnauthorizedException('Invalid username or password');
      }

      const token = this.jwtService.sign(
        { username: user.username },
        { expiresIn: '5h' }
      );

      return {
        user,
        token,
      };
    } catch (error) {
      throw new BadRequestException('Login failed: ' + error.message);
    }
  }

  async register(registerDto: registerDto): Promise<any> {
    const { nama, username, password } = registerDto;

    try {
      if (!nama || !username || !password) {
        throw new BadRequestException('Name, username, and password are required.');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await this.userService.createUser({
        nama,
        username,
        password: hashedPassword,
      });

      return {
        user,
      };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        throw new BadRequestException('Username is already taken');
      }
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}
