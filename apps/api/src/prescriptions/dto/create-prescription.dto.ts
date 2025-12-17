import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrescriptionDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    appointmentid: number;

    @ApiProperty({ example: '2025-01-15T09:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiPropertyOptional({ example: 'Take one pill daily' })
    @IsString()
    @IsOptional()
    notes?: string;
}
