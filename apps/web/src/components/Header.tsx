import Link from 'next/link';
import { Button } from './ui/Button';

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-oradent-blue">
          Ora<span className="text-oradent-teal">Dent</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/login/admin" className="text-sm font-semibold text-gray-400 hover:text-oradent-blue hidden md:block">
            ADMIN PORTAL
          </Link>
          <Link href="/login/patient">
            <Button variant="primary" className="rounded-full">Patient Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}