import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Try to get real doctors from the database
    const doctors = await db.user.findMany({
      where: { role: 'Doctor' },
    });

    // 2. If the database is empty, return "Demo Doctors" so the UI isn't blank
    if (doctors.length === 0) {
      return NextResponse.json([
        { name: "Dr. Arshad Khan", specialty: "Orthodontics", bio: "Senior Surgeon", photo: null },
        { name: "Dr. Sara Ahmed", specialty: "General Dentist", bio: "Family Care", photo: null },
        { name: "Dr. Naila Raza", specialty: "Pediatrician", bio: "Kids Specialist", photo: null }
      ]);
    }

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Database Error:", error);
    // Return empty array instead of crashing
    return NextResponse.json([]);
  }
}