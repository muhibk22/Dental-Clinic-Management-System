import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin', description: 'The username of the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'password', description: 'The password of the user' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
