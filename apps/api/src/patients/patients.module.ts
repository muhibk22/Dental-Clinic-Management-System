import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  providers: [PatientsService],
  controllers: [PatientsController]
})
export class PatientsModule {}
