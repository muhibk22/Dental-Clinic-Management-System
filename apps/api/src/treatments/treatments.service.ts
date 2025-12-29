import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(private prisma: PrismaService) { }

  async create(createTreatmentDto: CreateTreatmentDto) {
    return this.prisma.treatment.create({
      data: {
        patientid: createTreatmentDto.patientid,
        name: createTreatmentDto.name,
        description: createTreatmentDto.description,
        status: createTreatmentDto.status || 'PLANNED',
        startdate: createTreatmentDto.startdate ? new Date(createTreatmentDto.startdate) : undefined,
        enddate: createTreatmentDto.enddate ? new Date(createTreatmentDto.enddate) : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.treatment.findMany({
      where: { isdeleted: false },
    });
  }

  async findOne(id: number) {
    return this.prisma.treatment.findFirst({
      where: { treatmentid: id, isdeleted: false },
    });
  }
}
