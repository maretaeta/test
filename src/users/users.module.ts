import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";


@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService]
})

export class UserModule{}