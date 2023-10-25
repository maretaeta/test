import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Users } from "./users.model";


@Injectable()
export class UserService{
    constructor(private prisma:PrismaService){}


    async getAllUsers():Promise<Users[]>{
        return this.prisma.users.findMany()
    }

    async createUser(data:Users): Promise<Users>{
        const exiting = await this.prisma.users.findFirst({
            where: {
                    username: data.username
            }
        })

        if(exiting){
            throw new ConflictException('username already exists')
        }

        return this.prisma.users.create({
            data,
        })
    }
}