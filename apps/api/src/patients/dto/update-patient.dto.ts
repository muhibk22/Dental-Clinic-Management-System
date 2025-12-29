import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
    @ApiPropertyOptional({ example: 'John Doe Updated' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: '1980-01-01' })
    @IsDateString()
    @IsOptional()
    dateofbirth?: string;

    @ApiPropertyOptional({ example: 'Male' })
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional({ example: '555-5556' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: '456 New St' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: 'Updated history' })
    @IsString()
    @IsOptional()
    medicalhistory?: string;
}
