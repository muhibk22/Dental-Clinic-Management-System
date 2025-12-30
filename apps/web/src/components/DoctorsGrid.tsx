import Image from 'next/image';
import { Stethoscope } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// This interface defines what a "Doctor" looks like from the API
interface Doctor {
  doctorid: number;
  name: string;
  specialization?: string | null;
  email?: string | null;
  phone?: string | null;
}

// Fallback demo doctors for when API is unavailable
const demoDoctors: Doctor[] = [
  { doctorid: 1, name: "Dr. Arshad Khan", specialization: "Orthodontics", email: "arshad@fdc.com", phone: null },
  { doctorid: 2, name: "Dr. Sara Ahmed", specialization: "General Dentist", email: "sara@fdc.com", phone: null },
  { doctorid: 3, name: "Dr. Naila Raza", specialization: "Pediatrics", email: "naila@fdc.com", phone: null },
];

export default async function DoctorsGrid() {
  let doctors: Doctor[] = [];

  try {
    // Fetch doctors from the backend API
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      cache: 'no-store', // Always get fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      doctors = await response.json();
    }
  } catch (e) {
    console.error("Failed to fetch doctors from API:", e);
  }

  // Use fallback data if API returns empty or fails
  if (doctors.length === 0) {
    doctors = demoDoctors;
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-10">Meet Our Doctors</h2>

        {/* Grid set to exactly 3 columns for your presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc: Doctor) => (
            <div key={doc.doctorid} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-center h-full text-slate-300">
                  <Stethoscope size={64} strokeWidth={1} />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-[#1e3a8a]">{doc.name}</h3>
                <p className="text-sm font-bold text-[#14b8a6] uppercase tracking-widest mt-1">
                  {doc.specialization || "Dental Surgeon"}
                </p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed line-clamp-3">
                  {doc.email || "Dedicated to providing high-quality dental care and a comfortable experience for all patients."}
                </p>

                <button className="mt-8 w-full py-3 bg-slate-50 text-[#1e3a8a] font-bold rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all shadow-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}