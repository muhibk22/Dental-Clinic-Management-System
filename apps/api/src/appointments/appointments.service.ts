import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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
        status: 'Scheduled',
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
    const appointment = await this.prisma.appointment.findFirst({
      where: { appointmentid: id, isdeleted: false },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      }
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(id);

    return this.prisma.appointment.update({
      where: { appointmentid: id },
      data: {
        ...(updateAppointmentDto.appointmenttime && { appointmenttime: new Date(updateAppointmentDto.appointmenttime) }),
        ...(updateAppointmentDto.status && { status: updateAppointmentDto.status }),
        ...(updateAppointmentDto.notes && { notes: updateAppointmentDto.notes }),
      },
      include: {
        patient: true,
        doctor: true,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.appointment.update({
      where: { appointmentid: id },
      data: { isdeleted: true },
    });
  }
}
