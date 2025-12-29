"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { login as apiLogin } from '@/lib/api';
import { getDashboardPath } from '@/lib/auth';

export default function StaffLogin() {
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
            // Redirect based on role from the response
            const role = result.data.user.role;
            const dashboardPath = getDashboardPath(role);
            router.push(dashboardPath);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="flex items-center justify-center pt-20">
                <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
                    <div className="text-center mb-8">
                        <span className="bg-slate-800 text-white px-4 py-1 rounded-lg text-xs font-bold uppercase">
                            Staff Portal
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 mt-4">Login</h1>
                        <p className="text-slate-500 mt-2 text-sm">
                            For Admin, Doctors, Receptionists, Pharmacists & Assistants
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Patient? <a href="/login/patient" className="text-teal-600 font-medium hover:underline">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
