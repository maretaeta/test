import {IsString, Length} from "class-validator"

export class registerDto {


    @IsString()
    @Length(5, 10)
    nama: string;

   @IsString()
   @Length(5,10)
   username: string

   @IsString()
   @Length(6, 100)
   password: string
   

}