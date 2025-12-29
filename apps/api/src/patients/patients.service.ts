import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
    constructor(private prisma: PrismaService) { }

    async create(createPatientDto: CreatePatientDto) {
        return this.prisma.patient.create({
            data: {
                name: createPatientDto.name,
                dateofbirth: new Date(createPatientDto.dateofbirth),
                gender: createPatientDto.gender,
                phone: createPatientDto.phone,
                address: createPatientDto.address,
                medicalhistory: createPatientDto.medicalhistory,
            },
        });
    }

    async findAll() {
        return this.prisma.patient.findMany({
            where: { isdeleted: false },
        });
    }

    async findOne(id: number) {
        const patient = await this.prisma.patient.findFirst({
            where: { patientid: id, isdeleted: false },
        });
        if (!patient) {
            throw new NotFoundException(`Patient #${id} not found`);
        }
        return patient;
    }

    async update(id: number, updatePatientDto: UpdatePatientDto) {
        // Check if patient exists
        await this.findOne(id);

        return this.prisma.patient.update({
            where: { patientid: id },
            data: {
                ...(updatePatientDto.name && { name: updatePatientDto.name }),
                ...(updatePatientDto.dateofbirth && { dateofbirth: new Date(updatePatientDto.dateofbirth) }),
                ...(updatePatientDto.gender && { gender: updatePatientDto.gender }),
                ...(updatePatientDto.phone && { phone: updatePatientDto.phone }),
                ...(updatePatientDto.address && { address: updatePatientDto.address }),
                ...(updatePatientDto.medicalhistory && { medicalhistory: updatePatientDto.medicalhistory }),
            },
        });
    }

    async remove(id: number) {
        // Check if patient exists
        await this.findOne(id);

        // Soft delete
        return this.prisma.patient.update({
            where: { patientid: id },
            data: { isdeleted: true },
        });
    }
}
