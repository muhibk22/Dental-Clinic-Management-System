import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    patientid: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    doctorid: number;

    @ApiProperty({ example: '2025-12-25T10:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    appointmenttime: string;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    receptionistid?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    treatmentid?: number;

    @ApiPropertyOptional({ example: 'Regular checkup' })
    @IsString()
    @IsOptional()
    notes?: string;
}
