"use client";
import React, { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function FileUpload({ label, accept = "image/*" }: { label: string, accept?: string }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="w-full space-y-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      
      <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-oradent-teal transition-all cursor-pointer group">
        {!file ? (
          <>
            <div className="p-4 bg-teal-50 rounded-full text-oradent-teal group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1 uppercase">Recommended: JPG, PNG or PDF (Max 5MB)</p>
            <input 
              type="file" 
              accept={accept}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </>
        ) : (
          <div className="flex items-center justify-between w-full bg-white p-4 rounded-xl border border-teal-100 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-teal-50 text-oradent-teal rounded-lg">
                {file.type.includes('image') ? <ImageIcon size={24} /> : <FileText size={24} />}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}