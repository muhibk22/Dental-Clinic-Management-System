import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(username: string) {
        return this.prisma.user.findFirst({
            where: { username, isdeleted: false },
        });
    }

    async findById(userid: bigint) {
        return this.prisma.user.findUnique({
            where: { userid },
        });
    }
}
