import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password', 10);

    // Upsert Admin User
    const adminUser = await prisma.user.upsert({
        where: { userid: 1 },
        update: {},
        create: {
            username: 'admin',
            passwordhash: password,
            role: 'ADMIN',
            tokenversion: 0,
        },
    });

    console.log({ adminUser });

    // Upsert Doctor User
    const doctorUser = await prisma.user.upsert({
        where: { userid: 2 },
        update: {},
        create: {
            username: 'doctor',
            passwordhash: password,
            role: 'DOCTOR',
            tokenversion: 0,
        },
    });

    // Create/Upsert Doctor Profile linked to user 2
    const doctorProfile = await prisma.doctor.upsert({
        where: { userid: 2 },
        update: {},
        create: {
            userid: 2,
            name: "Dr. Gregory House",
            specialization: "Diagnostician",
            phone: "555-0199",
            email: "house@clinic.com"
        }
    });

    console.log({ doctorUser, doctorProfile });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
