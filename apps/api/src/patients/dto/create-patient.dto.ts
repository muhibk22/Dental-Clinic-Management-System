import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '1980-01-01' })
    @IsDateString()
    @IsNotEmpty()
    dateofbirth: string;

    @ApiPropertyOptional({ example: 'Male' })
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional({ example: '555-5555' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Fake St' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: 'None' })
    @IsString()
    @IsOptional()
    medicalhistory?: string;
}
