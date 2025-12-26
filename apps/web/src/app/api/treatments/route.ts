import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Logic: Insert into Treatments table with attributes:
  // PatientID, DoctorID, Name, Status, and IsDeleted=false
  
  return NextResponse.json({ 
    message: "Treatment created successfully",
    data: body 
  }, { status: 201 });
}