import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) { }

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    return this.prisma.prescription.create({
      data: {
        appointmentid: createPrescriptionDto.appointmentid,
        date: new Date(createPrescriptionDto.date),
        notes: createPrescriptionDto.notes,
      },
      include: {
        appointment: true,
        prescriptionItems: { include: { medicine: true } },
      }
    });
  }

  async findAll() {
    return this.prisma.prescription.findMany({
      where: { isdeleted: false },
      include: {
        appointment: true,
        prescriptionItems: { include: { medicine: true } },
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.prescription.findFirst({
      where: { prescriptionid: id, isdeleted: false },
      include: {
        appointment: true,
        prescriptionItems: { include: { medicine: true } },
      }
    });
  }
}
