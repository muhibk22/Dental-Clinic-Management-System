import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) { }

  async create(createMedicineDto: CreateMedicineDto) {
    return this.prisma.medicine.create({
      data: {
        name: createMedicineDto.name,
        quantity: createMedicineDto.quantity,
        price: createMedicineDto.price,
        availabilitystatus: createMedicineDto.availabilitystatus ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.medicine.findMany({
      where: { isdeleted: false },
    });
  }

  async findOne(id: number) {
    return this.prisma.medicine.findFirst({
      where: { medicineid: id, isdeleted: false },
    });
  }
}
