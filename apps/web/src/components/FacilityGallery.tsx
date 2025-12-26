"use client";
import React from 'react';
import Image from 'next/image';

const facilities = [
  { id: 1, title: "Modern Dental Suite", image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800", tag: "Tech" },
  { id: 2, title: "Surgery Room", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800", tag: "Clinic" },
  { id: 3, title: "Patient Lounge", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800", tag: "Comfort" }
];

export default function FacilityGallery() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-black text-[#1e3a8a] mb-12 uppercase tracking-tighter">Our Facility</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {facilities.map((f) => (
          <div key={f.id} className="relative h-96 rounded-[3rem] overflow-hidden shadow-xl group">
            {/* Optimized Next.js Image */}
            <Image 
              src={f.image} 
              alt={f.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
              priority={f.id === 1} // Loads the first image faster
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-transparent to-transparent opacity-70" />
            
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                {f.tag}
              </span>
              <h3 className="text-2xl font-bold mt-2 leading-tight">{f.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}