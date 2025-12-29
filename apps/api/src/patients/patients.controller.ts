import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @ApiOperation({ summary: 'Create a new patient' })
    @ApiResponse({ status: 201, description: 'The patient has been successfully created.' })
    @Post()
    @Roles('ADMIN', 'DOCTOR', 'RECEPTIONIST')
    create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientsService.create(createPatientDto);
    }

    @ApiOperation({ summary: 'Get all patients' })
    @ApiResponse({ status: 200, description: 'Return all patients.' })
    @Get()
    @Roles('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'ASSISTANT', 'PHARMACIST')
    findAll() {
        return this.patientsService.findAll();
    }

    @ApiOperation({ summary: 'Get a patient by ID' })
    @ApiResponse({ status: 200, description: 'Return the patient.' })
    @Get(':id')
    @Roles('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.findOne(id);
    }
}
