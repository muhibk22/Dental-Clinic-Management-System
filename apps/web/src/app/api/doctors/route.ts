import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
            // If backend fails, return demo doctors for development
            if (response.status === 401) {
                return NextResponse.json([
                    { doctorid: 1, name: "Dr. Arshad Khan", specialization: "Orthodontics", phone: null, email: null },
                    { doctorid: 2, name: "Dr. Sara Ahmed", specialization: "General Dentist", phone: null, email: null },
                    { doctorid: 3, name: "Dr. Naila Raza", specialization: "Pediatrics", phone: null, email: null }
                ]);
            }
            throw new Error(`Backend error: ${response.status}`);
        }

        const doctors = await response.json();
        return NextResponse.json(doctors);
    } catch (error) {
        console.error("API Error:", error);
        // Return demo data on error
        return NextResponse.json([
            { doctorid: 1, name: "Dr. Arshad Khan", specialization: "Orthodontics", phone: null, email: null },
            { doctorid: 2, name: "Dr. Sara Ahmed", specialization: "General Dentist", phone: null, email: null },
            { doctorid: 3, name: "Dr. Naila Raza", specialization: "Pediatrics", phone: null, email: null }
        ]);
    }
}
