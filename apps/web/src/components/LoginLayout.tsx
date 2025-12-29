"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { login as apiLogin } from '@/lib/api';
import { getDashboardPath } from '@/lib/auth';

interface LoginLayoutProps {
  role: string;
  themeColor: string;
  showRegister?: boolean;
}

export default function LoginLayout({ role, themeColor, showRegister }: LoginLayoutProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-blue-50">
        <div className="text-center mb-10">
          <div className={`inline-block p-4 rounded-2xl ${themeColor} text-white mb-4`}>
            <span className="font-bold uppercase tracking-widest text-xs">{role} Portal</span>
          </div>
          <h2 className="text-3xl font-black text-oradent-blue tracking-tight">Login</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Please enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-oradent-teal" /> Remember me
            </label>
            <a href="#" className="hover:text-oradent-blue">Forgot Password?</a>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 rounded-2xl shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : `Sign In to ${role}`}
          </Button>
        </form>

        {showRegister && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              New patient?{' '}
              <Link href="/register/patient" className="text-oradent-teal font-black hover:underline underline-offset-4">
                Create an Account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}