import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

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
    const treatment = await this.prisma.treatment.findFirst({
      where: { treatmentid: id, isdeleted: false },
    });
    if (!treatment) {
      throw new NotFoundException(`Treatment #${id} not found`);
    }
    return treatment;
  }

  async update(id: number, updateTreatmentDto: UpdateTreatmentDto) {
    await this.findOne(id);
    return this.prisma.treatment.update({
      where: { treatmentid: id },
      data: {
        ...(updateTreatmentDto.name && { name: updateTreatmentDto.name }),
        ...(updateTreatmentDto.description && { description: updateTreatmentDto.description }),
        ...(updateTreatmentDto.status && { status: updateTreatmentDto.status }),
        ...(updateTreatmentDto.enddate && { enddate: new Date(updateTreatmentDto.enddate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.treatment.update({
      where: { treatmentid: id },
      data: { isdeleted: true },
    });
  }
}
