import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOneById(payload.id)
        
        
        if (user) {
            const { password, ...dataValues } = user['dataValues'];
            if (!dataValues.deletedAt) {
                return dataValues
            }
            throw new UnauthorizedException('user not found!');
        } else if (!user) {
            throw new UnauthorizedException('user not found!');
        }
    }
}