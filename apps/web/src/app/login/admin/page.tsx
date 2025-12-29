"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { login as apiLogin } from '@/lib/api';
import { getDashboardPath } from '@/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await apiLogin({ username, password });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.data) {
      const dashboardPath = getDashboardPath(result.data.user.role);
      router.push(dashboardPath);
    }
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full p-4 bg-slate-100 rounded-xl mt-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-4 bg-slate-100 rounded-xl mt-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}