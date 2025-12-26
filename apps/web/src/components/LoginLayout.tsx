import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface LoginLayoutProps {
  role: string;
  themeColor: string;
  showRegister?: boolean;
}

export default function LoginLayout({ role, themeColor, showRegister }: LoginLayoutProps) {
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

        <form className="space-y-5">
          <Input label="Email Address" type="email" placeholder="email@oradent.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-oradent-teal" /> Remember me
            </label>
            <a href="#" className="hover:text-oradent-blue">Forgot Password?</a>
          </div>

          <Button variant="primary" className="w-full py-4 rounded-2xl shadow-lg">
            Sign In to {role}
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