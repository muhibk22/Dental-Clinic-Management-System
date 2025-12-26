"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Doctor {
  name: string;
  specialty: string;
  bio: string;
  photo: string;
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // Fetch the doctors you added via Admin
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {doctors.map((doc, index) => (
        <div key={index} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-48 bg-slate-200 relative">
            {doc.photo && <Image src={doc.photo} alt={doc.name} fill className="object-cover" />}
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-oradent-blue">{doc.name}</h3>
            <p className="text-oradent-teal font-bold text-xs uppercase">{doc.specialty || "General Dentist"}</p>
            <p className="text-gray-500 text-sm mt-2">{doc.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}