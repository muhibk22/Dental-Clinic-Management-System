import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsDecimal, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicineDto {
    @ApiProperty({ example: 'Paracetamol' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 5.50 })
    @IsNotEmpty()
    price: number; // Decimal

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    availabilitystatus?: boolean;
}
