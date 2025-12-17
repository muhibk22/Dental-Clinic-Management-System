import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTreatmentDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    patientid: number;

    @ApiProperty({ example: 'Root Canal' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Treatment for tooth #12' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'PLANNED' })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({ example: '2025-01-01T10:00:00Z' })
    @IsDateString()
    @IsOptional()
    startdate?: string;

    @ApiPropertyOptional({ example: '2025-01-01T11:00:00Z' })
    @IsDateString()
    @IsOptional()
    enddate?: string;
}
