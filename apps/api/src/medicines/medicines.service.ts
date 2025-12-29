import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) { }

  async create(createMedicineDto: CreateMedicineDto) {
    // Note: availabilitystatus is a generated column (quantity > 0), don't set it manually
    return this.prisma.medicine.create({
      data: {
        name: createMedicineDto.name,
        quantity: createMedicineDto.quantity,
        price: createMedicineDto.price,
      },
    });
  }

  async findAll() {
    return this.prisma.medicine.findMany({
      where: { isdeleted: false },
    });
  }

  async findOne(id: number) {
    const medicine = await this.prisma.medicine.findFirst({
      where: { medicineid: id, isdeleted: false },
    });
    if (!medicine) {
      throw new NotFoundException(`Medicine #${id} not found`);
    }
    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    await this.findOne(id);
    // Note: availabilitystatus is a generated column, don't update it manually
    return this.prisma.medicine.update({
      where: { medicineid: id },
      data: {
        ...(updateMedicineDto.name && { name: updateMedicineDto.name }),
        ...(updateMedicineDto.quantity !== undefined && { quantity: updateMedicineDto.quantity }),
        ...(updateMedicineDto.price !== undefined && { price: updateMedicineDto.price }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.medicine.update({
      where: { medicineid: id },
      data: { isdeleted: true },
    });
  }
}
