import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) { }

  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({ status: 201, description: 'The bill has been successfully created.' })
  @Post()
  @Roles('ADMIN', 'RECEPTIONIST')
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @ApiOperation({ summary: 'Get all bills' })
  @ApiResponse({ status: 200, description: 'Return all bills.' })
  @Get()
  @Roles('ADMIN', 'RECEPTIONIST')
  findAll() {
    return this.billingService.findAll();
  }

  @ApiOperation({ summary: 'Get a bill by ID' })
  @ApiResponse({ status: 200, description: 'Return the bill.' })
  @Get(':id')
  @Roles('ADMIN', 'RECEPTIONIST')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a bill' })
  @ApiResponse({ status: 200, description: 'The bill has been successfully updated.' })
  @Patch(':id')
  @Roles('ADMIN', 'RECEPTIONIST')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(id, updateBillingDto);
  }

  @ApiOperation({ summary: 'Delete a bill (soft delete)' })
  @ApiResponse({ status: 200, description: 'The bill has been successfully deleted.' })
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.remove(id);
  }
}
