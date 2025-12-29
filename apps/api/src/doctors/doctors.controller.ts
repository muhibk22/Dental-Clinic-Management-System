import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @ApiOperation({ summary: 'Create a new doctor profile' })
  @ApiResponse({ status: 201, description: 'The doctor has been successfully created.' })
  @Post()
  @Roles('ADMIN')
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Return all doctors.' })
  @Get()
  @Roles('ADMIN', 'RECEPTIONIST')
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Return the doctor.' })
  @Get(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a doctor profile' })
  @ApiResponse({ status: 200, description: 'The doctor has been successfully updated.' })
  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @ApiOperation({ summary: 'Delete a doctor (soft delete)' })
  @ApiResponse({ status: 200, description: 'The doctor has been successfully deleted.' })
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
