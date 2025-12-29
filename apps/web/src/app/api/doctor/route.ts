import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Demo doctors for fallback
const demoDoctors = [
  { doctorid: 1, name: "Dr. Arshad Khan", specialization: "Orthodontics", phone: null, email: null },
  { doctorid: 2, name: "Dr. Sara Ahmed", specialization: "General Dentist", phone: null, email: null },
  { doctorid: 3, name: "Dr. Naila Raza", specialization: "Pediatrics", phone: null, email: null }
];

export async function GET(request: Request) {
  try {
    // Get token from request headers if available
    const authHeader = request.headers.get('Authorization');

    const response = await fetch(`${API_BASE_URL}/doctors`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      // Return demo doctors if backend unavailable
      return NextResponse.json(demoDoctors);
    }

    const doctors = await response.json();
    return NextResponse.json(doctors.length > 0 ? doctors : demoDoctors);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(demoDoctors);
  }
}