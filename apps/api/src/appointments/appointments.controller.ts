import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'The appointment has been successfully created.' })
  @Post()
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR')
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments.' })
  @Get()
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR')
  findAll() {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @Get(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'DOCTOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }
}
