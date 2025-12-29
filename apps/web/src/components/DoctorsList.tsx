"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDoctors, Doctor } from '@/lib/api';

interface DoctorDisplay {
  name: string;
  specialty: string;
  bio: string;
  photo: string | null;
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<DoctorDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      const result = await getDoctors();

      if (result.error) {
        setError(result.error);
        // Fallback to demo data
        setDoctors([
          { name: "Dr. Arshad Khan", specialty: "Orthodontics", bio: "Senior Surgeon", photo: null },
          { name: "Dr. Sara Ahmed", specialty: "General Dentist", bio: "Family Care", photo: null },
          { name: "Dr. Naila Raza", specialty: "Pediatrician", bio: "Kids Specialist", photo: null }
        ]);
      } else if (result.data) {
        // Map API Doctor to display format
        const displayDoctors = result.data.map((doc: Doctor) => ({
          name: doc.name,
          specialty: doc.specialization || "General Dentist",
          bio: doc.email || "Expert Care",
          photo: null
        }));
        setDoctors(displayDoctors.length > 0 ? displayDoctors : [
          { name: "Dr. Arshad Khan", specialty: "Orthodontics", bio: "Senior Surgeon", photo: null },
          { name: "Dr. Sara Ahmed", specialty: "General Dentist", bio: "Family Care", photo: null },
          { name: "Dr. Naila Raza", specialty: "Pediatrician", bio: "Kids Specialist", photo: null }
        ]);
      }
      setLoading(false);
    }

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-200" />
            <div className="p-6 text-center">
              <div className="h-6 bg-slate-200 rounded mb-2" />
              <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {doctors.map((doc, index) => (
        <div key={index} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-48 bg-slate-200 relative">
            {doc.photo && <Image src={doc.photo} alt={doc.name} fill className="object-cover" />}
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-oradent-blue">{doc.name}</h3>
            <p className="text-oradent-teal font-bold text-xs uppercase">{doc.specialty}</p>
            <p className="text-gray-500 text-sm mt-2">{doc.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}