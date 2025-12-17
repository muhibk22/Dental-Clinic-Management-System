import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
    @ApiProperty({ example: '1', description: 'User ID' })
    @IsNumberString() // simplified for BigInt handling from JSON
    @IsNotEmpty()
    userid: string;

    @ApiProperty({ example: 'Dr. House', description: 'Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Diagnostician' })
    @IsString()
    @IsOptional()
    specialization?: string;

    @ApiPropertyOptional({ example: '555-1234' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'house@clinic.com' })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsObject()
    @IsOptional()
    schedule?: any;
}
