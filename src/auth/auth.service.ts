import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
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

    console.log('Received password:', password);
    console.log('Stored hashed password:', user.password);

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new BadRequestException('Invalid Password');
    }

    const token = this.jwtService.sign(
      { username: user.username },
      { expiresIn: '5h' }
    );

    console.log('Login successful for user:', username);

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
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = await this.userService.createUser({
        nama,
        username,
        password: hashedPassword,
      });

      return {
        user,
      };
    } catch (error) {
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}
