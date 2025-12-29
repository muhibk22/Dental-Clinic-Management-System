import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const users = await this.prisma.user.findMany({
            where: { isdeleted: false },
            include: {
                doctor: true,
                receptionist: true,
                pharmacist: true,
                assistant: true,
            },
            orderBy: { userid: 'asc' },
        });

        // Map to a cleaner response
        return users.map(user => ({
            userid: user.userid.toString(),
            username: user.username,
            role: user.role,
            isdeleted: user.isdeleted,
            profile: user.doctor || user.receptionist || user.pharmacist || user.assistant || null,
        }));
    }

    async findOne(username: string) {
        return this.prisma.user.findFirst({
            where: { username, isdeleted: false },
        });
    }

    async findById(userid: bigint) {
        return this.prisma.user.findUnique({
            where: { userid },
            include: {
                doctor: true,
                receptionist: true,
                pharmacist: true,
                assistant: true,
            },
        });
    }

    async create(createUserDto: CreateUserDto) {
        // Check if username already exists
        const existing = await this.prisma.user.findFirst({
            where: { username: createUserDto.username },
        });
        if (existing) {
            throw new ConflictException('Username already exists');
        }

        // Hash password
        const passwordhash = await bcrypt.hash(createUserDto.password, 10);

        // Create user and role-specific profile in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Create base user
            const user = await tx.user.create({
                data: {
                    username: createUserDto.username,
                    passwordhash,
                    role: createUserDto.role,
                },
            });

            // Create role-specific profile
            const profileName = createUserDto.name || createUserDto.username;

            switch (createUserDto.role) {
                case 'DOCTOR':
                    await tx.doctor.create({
                        data: {
                            userid: user.userid,
                            name: profileName,
                            specialization: createUserDto.specialization || 'General Dentist',
                            email: createUserDto.email || `${createUserDto.username}@clinic.local`,
                            phone: createUserDto.phone,
                        },
                    });
                    break;
                case 'RECEPTIONIST':
                    await tx.receptionist.create({
                        data: {
                            userid: user.userid,
                            name: profileName,
                            phone: createUserDto.phone,
                        },
                    });
                    break;
                case 'PHARMACIST':
                    await tx.pharmacist.create({
                        data: {
                            userid: user.userid,
                            name: profileName,
                            phone: createUserDto.phone,
                        },
                    });
                    break;
                case 'ASSISTANT':
                    if (!createUserDto.doctorid) {
                        throw new ConflictException('doctorid is required for ASSISTANT role');
                    }
                    await tx.assistant.create({
                        data: {
                            userid: user.userid,
                            name: profileName,
                            phone: createUserDto.phone,
                            doctorid: BigInt(createUserDto.doctorid),
                        },
                    });
                    break;
                // ADMIN doesn't need a profile table
            }

            return user;
        });

        return {
            userid: result.userid.toString(),
            username: result.username,
            role: result.role,
        };
    }

    async update(userid: number, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { userid: BigInt(userid) },
        });
        if (!user || user.isdeleted) {
            throw new NotFoundException('User not found');
        }

        // Prepare update data
        const updateData: any = {};
        if (updateUserDto.username) updateData.username = updateUserDto.username;
        if (updateUserDto.password) {
            updateData.passwordhash = await bcrypt.hash(updateUserDto.password, 10);
        }

        // Update user
        await this.prisma.user.update({
            where: { userid: BigInt(userid) },
            data: updateData,
        });

        // Update role-specific profile if fields provided
        if (updateUserDto.name || updateUserDto.phone || updateUserDto.specialization || updateUserDto.email) {
            const profileData: any = {};
            if (updateUserDto.name) profileData.name = updateUserDto.name;
            if (updateUserDto.phone) profileData.phone = updateUserDto.phone;

            switch (user.role) {
                case 'DOCTOR':
                    if (updateUserDto.specialization) profileData.specialization = updateUserDto.specialization;
                    if (updateUserDto.email) profileData.email = updateUserDto.email;
                    await this.prisma.doctor.update({
                        where: { userid: BigInt(userid) },
                        data: profileData,
                    });
                    break;
                case 'RECEPTIONIST':
                    await this.prisma.receptionist.update({
                        where: { userid: BigInt(userid) },
                        data: profileData,
                    });
                    break;
                case 'PHARMACIST':
                    await this.prisma.pharmacist.update({
                        where: { userid: BigInt(userid) },
                        data: profileData,
                    });
                    break;
                case 'ASSISTANT':
                    await this.prisma.assistant.update({
                        where: { userid: BigInt(userid) },
                        data: profileData,
                    });
                    break;
            }
        }

        return { message: 'User updated successfully' };
    }

    async remove(userid: number) {
        // Soft delete
        await this.prisma.user.update({
            where: { userid: BigInt(userid) },
            data: { isdeleted: true },
        });
        return { message: 'User deleted successfully' };
    }
}
