import { Prisma } from "@prisma/client";

export class Users implements Prisma.UsersCreateInput{
    nama?: string;
    username?: string;
    password?: string;
}