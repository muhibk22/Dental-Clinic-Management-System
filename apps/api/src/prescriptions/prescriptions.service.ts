import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

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
    const prescription = await this.prisma.prescription.findFirst({
      where: { prescriptionid: id, isdeleted: false },
      include: {
        appointment: true,
        prescriptionItems: { include: { medicine: true } },
      }
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }
    return prescription;
  }

  async update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    await this.findOne(id);
    return this.prisma.prescription.update({
      where: { prescriptionid: id },
      data: {
        ...(updatePrescriptionDto.notes && { notes: updatePrescriptionDto.notes }),
      },
      include: {
        appointment: true,
        prescriptionItems: { include: { medicine: true } },
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prescription.update({
      where: { prescriptionid: id },
      data: { isdeleted: true },
    });
  }
}
