"use client";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/components/Header';
import Link from 'next/link';

export default function PatientRegister() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-blue-50">
          <h2 className="text-3xl font-bold text-oradent-blue text-center mb-2">Patient Registration</h2>
          <p className="text-center text-gray-500 mb-8">Create your profile to view medical records</p>
          
          <form className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" required />
            <Input label="Email Address" type="email" placeholder="john@example.com" required />
            <Input label="Phone Number" type="tel" placeholder="+1 234 567 890" required />
            <Input label="Password" type="password" required />
            <Input label="Confirm Password" type="password" required />
            
            <Button variant="teal" className="w-full py-4 mt-4">Create Account</Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already registered? <Link href="/login/patient" className="text-oradent-blue font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}