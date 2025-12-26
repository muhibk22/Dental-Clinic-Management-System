import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Stethoscope, Pill, Calendar, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import FacilityGallery from '@/components/FacilityGallery'; // Your gallery component
import DoctorsGrid from '@/components/DoctorsGrid'; // Your doctors grid component

const portals = [
  { name: 'Patient', icon: <User size={32} />, path: '/login/patient', color: 'bg-blue-600' },
  { name: 'Doctor', icon: <Stethoscope size={32} />, path: '/login/doctor', color: 'bg-teal-600' },
  { name: 'Assistant', icon: <HeartPulse size={32} />, path: '/login/assistant', color: 'bg-blue-800' },
  { name: 'Pharmacist', icon: <Pill size={32} />, path: '/login/pharmacist', color: 'bg-teal-700' },
  { name: 'Receptionist', icon: <Calendar size={32} />, path: '/login/receptionist', color: 'bg-indigo-700' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-teal-50 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-oradent-blue mb-6">
              Certified & Experienced <br/> <span className="text-oradent-teal">Dental Excellence</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Access your medical records, book appointments, and manage clinic operations with our integrated healthcare portal.
            </p>
          </div>
        </section>

        {/* Portal Selection Grid */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-oradent-blue mb-12 uppercase tracking-widest">Select Your Portal</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {portals.map((p) => (
              <Link key={p.name} href={p.path} className="group">
                <div className={`${p.color} h-48 rounded-3xl p-6 text-white flex flex-col items-center justify-center gap-4 shadow-xl group-hover:scale-105 transition-all duration-300`}>
                  <div className="bg-white/20 p-4 rounded-2xl">{p.icon}</div>
                  <span className="font-bold uppercase tracking-wider text-sm">{p.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* NEW: Facility Gallery Section */}
        <section id="facility">
          <FacilityGallery />
        </section>

        {/* NEW: Doctors Grid Section */}
        <section id="doctors" className="bg-slate-50">
          <DoctorsGrid />
        </section>
        
      </main>
      <Footer />
    </div>
  );
};