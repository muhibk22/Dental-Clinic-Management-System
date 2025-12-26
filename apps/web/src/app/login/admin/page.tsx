"use client"; // This MUST be at the very top

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This line forces the browser to go to the dashboard
    router.push('/dashboard/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex items-center justify-center pt-20">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <span className="bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-bold uppercase">
              Admin Portal
            </span>
            <h1 className="text-4xl font-black text-slate-900 mt-4">Login</h1>
          </div>

          {/* ADD THE onSubmit HANDLER HERE */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@oradent.com"
                className="w-full p-4 bg-slate-100 rounded-xl mt-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <input 
                type="password" 
                defaultValue="password"
                className="w-full p-4 bg-slate-100 rounded-xl mt-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all"
            >
              Sign In to Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}