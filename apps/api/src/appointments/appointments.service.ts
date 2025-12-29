import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        patientid: createAppointmentDto.patientid,
        doctorid: createAppointmentDto.doctorid,
        appointmenttime: new Date(createAppointmentDto.appointmenttime),
        receptionistid: createAppointmentDto.receptionistid,
        treatmentid: createAppointmentDto.treatmentid,
        notes: createAppointmentDto.notes,
        status: 'SCHEDULED',
      },
      include: {
        patient: true,
        doctor: true,
      }
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      where: { isdeleted: false },
      include: {
        patient: true,
        doctor: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findFirst({
      where: { appointmentid: id, isdeleted: false },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      }
    });
  }
}
