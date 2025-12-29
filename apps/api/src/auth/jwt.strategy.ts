import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findById(BigInt(payload.sub));
        if (!user || user.isdeleted || user.tokenversion !== payload.tokenversion) {
            throw new UnauthorizedException();
        }
        // Return a safe object. BigInt is annoying in JSON, so we convert ID to string.
        return { userid: user.userid.toString(), username: user.username, role: user.role };
    }
}
