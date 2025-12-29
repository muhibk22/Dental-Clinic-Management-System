import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
    @ApiPropertyOptional({ example: '2025-12-26T10:00:00Z' })
    @IsDateString()
    @IsOptional()
    appointmenttime?: string;

    @ApiPropertyOptional({ example: 'Completed', description: 'Scheduled | Completed | Cancelled' })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({ example: 'Updated notes' })
    @IsString()
    @IsOptional()
    notes?: string;
}
