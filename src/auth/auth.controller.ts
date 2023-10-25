import { Body, Controller, Post, Req, Res } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from "./auth.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { loginDto } from "./dto/login-user.dto";
import { Request, Response } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { registerDto } from "./dto/register-user.dto";


@Controller('api/v1/auth')
export class AuthController{

    constructor(private readonly AuthService: AuthService){}

    @Post('login')
    async login(@Req() request:Request, @Res() response: Response, @Body() loginDto: loginDto):Promise<any>{
        try{
            const result = await this.AuthService.login(loginDto);
            return response.status(200).json({
                 status: 'Okay',
                    message: 'Successfully Login',
                    result: result

                })
        }catch(err){
            return response.status(500).json({
                status:'Error',
                message: 'Internal Service Error',
                error: err.message, 
                
            })
        }
    }

    @Post('register')
    async register(@Req() request: Request, @Res() response: Response, @Body() registerDto: registerDto): Promise<any> {
        try {
            const result = await this.AuthService.register(registerDto);
            if (!result) {
            return response.status(400).json({
                status: 'Error',
                message: 'Registration failed',
                });
            }

            return response.status(200).json({
                status: 'Okay',
                message: 'Successfully registered',
                result: result,
            });
        } catch (err) {
            return response.status(500).json({
                status: 'Error',
                message: 'Internal Service Error',
                error: err.message,
            });
        }
    }
}