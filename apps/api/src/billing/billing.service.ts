import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) { }

  async create(createBillingDto: CreateBillingDto) {
    return this.prisma.billing.create({
      data: {
        appointmentid: createBillingDto.appointmentid,
        patientid: createBillingDto.patientid,
        totalamount: createBillingDto.totalamount,
        type: createBillingDto.type,
        paymentstatus: createBillingDto.paymentstatus || 'PENDING',
        date: new Date(createBillingDto.date),
      },
      include: {
        patient: true,
        appointment: true,
      }
    });
  }

  async findAll() {
    return this.prisma.billing.findMany({
      where: { isdeleted: false },
      include: {
        patient: true,
        appointment: true,
      }
    });
  }

  async findOne(id: number) {
    const billing = await this.prisma.billing.findFirst({
      where: { billingid: id, isdeleted: false },
      include: {
        patient: true,
        appointment: true,
      }
    });
    if (!billing) {
      throw new NotFoundException(`Billing #${id} not found`);
    }
    return billing;
  }

  async update(id: number, updateBillingDto: UpdateBillingDto) {
    await this.findOne(id);
    return this.prisma.billing.update({
      where: { billingid: id },
      data: {
        ...(updateBillingDto.paymentstatus && { paymentstatus: updateBillingDto.paymentstatus }),
        ...(updateBillingDto.totalamount !== undefined && { totalamount: updateBillingDto.totalamount }),
      },
      include: {
        patient: true,
        appointment: true,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.billing.update({
      where: { billingid: id },
      data: { isdeleted: true },
    });
  }
}
