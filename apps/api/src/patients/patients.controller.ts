import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
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

    @ApiOperation({ summary: 'Update a patient' })
    @ApiResponse({ status: 200, description: 'The patient has been successfully updated.' })
    @Patch(':id')
    @Roles('ADMIN', 'DOCTOR', 'RECEPTIONIST')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientsService.update(id, updatePatientDto);
    }

    @ApiOperation({ summary: 'Delete a patient (soft delete)' })
    @ApiResponse({ status: 200, description: 'The patient has been successfully deleted.' })
    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.remove(id);
    }
}
