import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Medicines')
@ApiBearerAuth()
@Controller('medicines')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) { }

  @ApiOperation({ summary: 'Add a new medicine' })
  @ApiResponse({ status: 201, description: 'The medicine has been successfully created.' })
  @Post()
  @Roles('ADMIN', 'PHARMACIST')
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @ApiOperation({ summary: 'Get all medicines' })
  @ApiResponse({ status: 200, description: 'Return all medicines.' })
  @Get()
  @Roles('ADMIN', 'PHARMACIST', 'DOCTOR')
  findAll() {
    return this.medicinesService.findAll();
  }

  @ApiOperation({ summary: 'Get a medicine by ID' })
  @ApiResponse({ status: 200, description: 'Return the medicine.' })
  @Get(':id')
  @Roles('ADMIN', 'PHARMACIST', 'DOCTOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicinesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a medicine' })
  @ApiResponse({ status: 200, description: 'The medicine has been successfully updated.' })
  @Patch(':id')
  @Roles('ADMIN', 'PHARMACIST')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedicineDto: UpdateMedicineDto) {
    return this.medicinesService.update(id, updateMedicineDto);
  }

  @ApiOperation({ summary: 'Delete a medicine (soft delete)' })
  @ApiResponse({ status: 200, description: 'The medicine has been successfully deleted.' })
  @Delete(':id')
  @Roles('PHARMACIST', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicinesService.remove(id);
  }
}
