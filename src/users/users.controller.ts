import { UserService } from "./users.service";
import { Controller, Get } from "@nestjs/common";



@Controller('api/v1/users')
export class UserController{
    constructor(private readonly usersService:UserService){}

    @Get()
    async getAllUsers(): Promise<any>{
       try {
            const result = await this.usersService.getAllUsers();
            return {
                status: 'Okay',
                message: 'Successfully fetch data',
                data: result,
            };
        } catch (error) {
            return {
                status: 'Error',
                messege: 'Internal Server Error',
                error: error.message,
            };
        } 
    }
}