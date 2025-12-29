import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillingDto } from './dto/create-billing.dto';

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
    return this.prisma.billing.findFirst({
      where: { billingid: id, isdeleted: false },
      include: {
        patient: true,
        appointment: true,
      }
    });
  }
}
