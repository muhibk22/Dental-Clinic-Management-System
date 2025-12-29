import { IsString, IsOptional, IsIn, MinLength, IsEmail, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe' })
    @IsString()
    @MinLength(3)
    username: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PHARMACIST', 'ASSISTANT'] })
    @IsString()
    @IsIn(['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PHARMACIST', 'ASSISTANT'])
    role: string;

    // Required for role-specific profile
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '+92 300 1234567' })
    @IsOptional()
    @IsString()
    phone?: string;

    // Doctor-specific
    @ApiPropertyOptional({ example: 'Orthodontist' })
    @IsOptional()
    @IsString()
    specialization?: string;

    @ApiPropertyOptional({ example: 'john@clinic.com' })
    @IsOptional()
    @ValidateIf((o) => o.email && o.email.length > 0)
    @IsEmail()
    email?: string;

    // Assistant-specific
    @ApiPropertyOptional({ example: 1, description: 'Doctor ID for assistant' })
    @IsOptional()
    doctorid?: number;
}
