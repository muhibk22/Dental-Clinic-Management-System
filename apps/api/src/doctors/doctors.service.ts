import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) { }

  async create(createDoctorDto: CreateDoctorDto) {
    // Note: In a real app we might create a User first, but here we assume simplicity 
    // or that the DTO might handle creation logic differently. 
    // However, the ERD says Doctor has a FK to User. 
    // For this university project, we might assume the User is created separately 
    // or we might simplify by just creating the Doctor record if the User exists.
    // Let's assume we pass the UserID in the DTO for simplicity.

    // Actually, looking at the DTO, it's empty. Let's fix that next.
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
      where: { isdeleted: false },
      include: { user: true }, // Simple join
    });
  }

  async findOne(id: number) {
    return this.prisma.doctor.findFirst({
      where: { doctorid: id, isdeleted: false },
    });
  }
}
