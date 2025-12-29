import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Treatments')
@ApiBearerAuth()
@Controller('treatments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) { }

  @ApiOperation({ summary: 'Create a new treatment' })
  @ApiResponse({ status: 201, description: 'The treatment has been successfully created.' })
  @Post()
  @Roles('ADMIN', 'DOCTOR')
  create(@Body() createTreatmentDto: CreateTreatmentDto) {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @ApiOperation({ summary: 'Get all treatments' })
  @ApiResponse({ status: 200, description: 'Return all treatments.' })
  @Get()
  @Roles('ADMIN', 'DOCTOR', 'RECEPTIONIST')
  findAll() {
    return this.treatmentsService.findAll();
  }

  @ApiOperation({ summary: 'Get a treatment by ID' })
  @ApiResponse({ status: 200, description: 'Return the treatment.' })
  @Get(':id')
  @Roles('ADMIN', 'DOCTOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a treatment' })
  @ApiResponse({ status: 200, description: 'The treatment has been successfully updated.' })
  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTreatmentDto: UpdateTreatmentDto) {
    return this.treatmentsService.update(id, updateTreatmentDto);
  }

  @ApiOperation({ summary: 'Delete a treatment (soft delete)' })
  @ApiResponse({ status: 200, description: 'The treatment has been successfully deleted.' })
  @Delete(':id')
  @Roles('ADMIN', 'DOCTOR')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentsService.remove(id);
  }
}
