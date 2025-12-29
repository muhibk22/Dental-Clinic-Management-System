import { IsNotEmpty, IsNumber, IsString, IsDecimal, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBillingDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    appointmentid: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    patientid: number;

    @ApiProperty({ example: 150.00 })
    @IsNotEmpty()
    totalamount: number; // Decimal handled as number/string in DTO usually

    @ApiProperty({ example: 'CASH' })
    @IsString()
    @IsNotEmpty()
    type: string; // Standard | FBR

    @ApiPropertyOptional({ example: 'PAID' })
    @IsString()
    @IsOptional()
    paymentstatus?: string;

    @ApiProperty({ example: '2025-01-15T09:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    date: string;
}
