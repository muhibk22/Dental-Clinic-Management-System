import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) { }

  async create(createDoctorDto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: {
        userid: BigInt(createDoctorDto.userid),
        name: createDoctorDto.name,
        specialization: createDoctorDto.specialization,
        phone: createDoctorDto.phone,
        email: createDoctorDto.email,
        schedule: createDoctorDto.schedule,
      },
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
      where: {
        isdeleted: false,
        user: { isdeleted: false }  // Also check if user account is deleted
      },
      include: { user: true },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { doctorid: id, isdeleted: false },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor #${id} not found`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    await this.findOne(id);

    return this.prisma.doctor.update({
      where: { doctorid: id },
      data: {
        ...(updateDoctorDto.name && { name: updateDoctorDto.name }),
        ...(updateDoctorDto.specialization && { specialization: updateDoctorDto.specialization }),
        ...(updateDoctorDto.phone && { phone: updateDoctorDto.phone }),
        ...(updateDoctorDto.email && { email: updateDoctorDto.email }),
        ...(updateDoctorDto.schedule && { schedule: updateDoctorDto.schedule }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.doctor.update({
      where: { doctorid: id },
      data: { isdeleted: true },
    });
  }
}
