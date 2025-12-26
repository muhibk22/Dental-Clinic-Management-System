import { db } from '@/lib/db';
import Image from 'next/image';
import { Stethoscope } from 'lucide-react';

// This interface defines what a "Doctor" looks like
interface Doctor {
  id: number | string;
  name: string;
  role: string;
  specialty?: string | null;
  bio?: string | null;
  photo?: string | null;
}

export default async function DoctorsGrid() {
  // Fetching from DB with fallback
  let doctors: Doctor[] = [];
  try {
    doctors = await db.user.findMany({
      where: { role: 'Doctor' },
      take: 6,
    });
  } catch (e) {
    console.error("Failed to fetch doctors:", e);
    // Fallback data for build/demo
    doctors = [
      { id: 1, name: "Dr. Demo", role: "Doctor", specialty: "General", bio: "Demo Bio", photo: null },
      { id: 2, name: "Dr. Example", role: "Doctor", specialty: "Ortho", bio: "Example Bio", photo: null },
    ];
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-10">Meet Our Doctors</h2>

        {/* Grid set to exactly 3 columns for your presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc: Doctor) => (
            <div key={doc.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                {doc.photo ? (
                  <Image
                    src={doc.photo}
                    alt={doc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <Stethoscope size={64} strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-[#1e3a8a]">{doc.name}</h3>
                <p className="text-sm font-bold text-[#14b8a6] uppercase tracking-widest mt-1">
                  {doc.specialty || "Dental Surgeon"}
                </p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed line-clamp-3">
                  {doc.bio || "Dedicated to providing high-quality dental care and a comfortable experience for all patients."}
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