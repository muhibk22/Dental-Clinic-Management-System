import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/Header';
import Link from 'next/link';

export default function PatientLogin() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-oradent-blue text-center mb-6">Patient Login</h2>
          <form className="space-y-5">
            <Input label="Email" type="email" required />
            <Input label="Password" type="password" required />
            <Button variant="primary" className="w-full">Sign In</Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Don&apos;t have an account? <Link href="/register/patient" className="text-oradent-teal font-bold underline">Register Now</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}