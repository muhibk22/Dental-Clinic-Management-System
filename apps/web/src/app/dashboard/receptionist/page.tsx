import { Calendar, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ReceptionistDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-oradent-blue">Reception Desk [cite: 8]</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border-l-4 border-l-oradent-blue shadow-sm">
          <Calendar className="text-oradent-blue mb-2" />
          <p className="text-gray-500">Here&apos;s a summary of today&apos;s appointments. [cite: 223]</p>
          <p className="text-2xl font-black text-oradent-blue">24</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold mb-4 border-b pb-2">Recent Invoices [cite: 187]</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="font-bold text-sm">Sara Khan [cite: 158]</p>
                <p className="text-xs text-gray-400">FBR Invoice [cite: 161, 191]</p>
              </div>
              <p className="font-black text-oradent-blue">Rs. 5,000 [cite: 160]</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 text-xs">View All Invoices [cite: 190]</Button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold mb-4 border-b pb-2">Quick Actions [cite: 169]</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary" className="text-xs">Book Appointment [cite: 170]</Button>
            <Button variant="teal" className="text-xs">Register Patient [cite: 166]</Button>
          </div>
        </div>
      </div>
    </div>
  );
}