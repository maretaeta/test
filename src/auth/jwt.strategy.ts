import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { PrismaService } from "src/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private readonly prismaService: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: { username: string}){
        console.log('JWT validation for username:', payload.username);
        const users = await this.prismaService.users.findFirst({
            where:{
                username: payload.username,
            }
        });

        if( !users){
            throw new UnauthorizedException();
        }

        return users;
    }
}