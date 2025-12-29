import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) { }

  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'The prescription has been successfully created.' })
  @Post()
  @Roles('ADMIN', 'DOCTOR')
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiResponse({ status: 200, description: 'Return all prescriptions.' })
  @Get()
  @Roles('ADMIN', 'DOCTOR', 'PHARMACIST')
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @ApiOperation({ summary: 'Get a prescription by ID' })
  @ApiResponse({ status: 200, description: 'Return the prescription.' })
  @Get(':id')
  @Roles('ADMIN', 'DOCTOR', 'PHARMACIST')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a prescription' })
  @ApiResponse({ status: 200, description: 'The prescription has been successfully updated.' })
  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @ApiOperation({ summary: 'Delete a prescription (soft delete)' })
  @ApiResponse({ status: 200, description: 'The prescription has been successfully deleted.' })
  @Delete(':id')
  @Roles('DOCTOR', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.remove(id);
  }
}
