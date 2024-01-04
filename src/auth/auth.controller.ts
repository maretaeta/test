import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { loginDto } from "./dto/login-user.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { registerDto } from "./dto/register-user.dto";

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: loginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        status: 'Okay',
        message: 'Successfully Login',
        result: result,
      });
    } catch (err) {
      return this.handleError(response, err, 'Login failed');
    }
  }

  @Post('register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: registerDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Okay',
        message: 'Successfully registered',
        result: result,
      });
    } catch (err) {
      return this.handleError(response, err, 'Registration failed');
    }
  }

  private handleError(response: Response, error: any, defaultMessage: string): any {
    let status = 500;
    let message = 'Internal Service Error';

    if (error?.status) {
      status = error.status;
    }

    if (error?.response?.message) {
      message = error.response.message;
    } else if (error?.message) {
      message = error.message;
    } else {
      message = defaultMessage;
    }

    return response.status(status).json({
      status: 'Error',
      message: message,
      error: error,
    });
  }
}
