import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { BillingModule } from './billing/billing.module';
import { MedicinesModule } from './medicines/medicines.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, PatientsModule, DoctorsModule, AppointmentsModule, TreatmentsModule, PrescriptionsModule, BillingModule, MedicinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
