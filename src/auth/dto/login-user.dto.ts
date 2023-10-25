import { IsString, Length } from "class-validator";

export class loginDto {


    @IsString()
    @Length(5, 10)
    username: string;

    @IsString()
    @Length(6, 100)
    password: string;
}