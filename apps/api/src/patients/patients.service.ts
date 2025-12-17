import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';

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
        return this.prisma.patient.findFirst({
            where: { patientid: id, isdeleted: false },
        });
    }
}
