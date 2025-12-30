import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.passwordhash))) {
            const { passwordhash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Get doctorid for doctors and assistants
        let doctorid: string | null = null;

        if (user.role === 'DOCTOR') {
            const doctor = await this.prisma.doctor.findUnique({
                where: { userid: BigInt(user.userid) },
            });
            if (doctor) {
                doctorid = doctor.doctorid.toString();
            }
        } else if (user.role === 'ASSISTANT') {
            // Assistant is linked to a specific doctor
            const assistant = await this.prisma.assistant.findUnique({
                where: { userid: BigInt(user.userid) },
            });
            if (assistant) {
                doctorid = assistant.doctorid.toString();
            }
        }

        const payload = {
            username: user.username,
            sub: user.userid.toString(),
            role: user.role,
            tokenversion: user.tokenversion
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                userid: user.userid.toString(),
                username: user.username,
                role: user.role,
                doctorid: doctorid, // Include doctorid for doctors and assistants
            }
        };
    }
}
