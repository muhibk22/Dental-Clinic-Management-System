import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
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
  @Roles('DOCTOR')
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiResponse({ status: 200, description: 'Return all prescriptions.' })
  @Get()
  @Roles('DOCTOR', 'PHARMACIST')
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @ApiOperation({ summary: 'Get a prescription by ID' })
  @ApiResponse({ status: 200, description: 'Return the prescription.' })
  @Get(':id')
  @Roles('DOCTOR', 'PHARMACIST')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findOne(id);
  }
}
