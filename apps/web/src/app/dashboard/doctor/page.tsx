import { Stethoscope, Plus, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DoctorDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-oradent-blue">Clinical Overview</h1>
          <p className="text-gray-500">Manage treatments, procedures, and patient records.</p>
        </div>
        <Button variant="teal"><Plus size={18}/> New Treatment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <Activity className="text-oradent-teal mb-2" />
          <h3 className="text-sm font-bold text-gray-400 uppercase">Active Treatments</h3>
          <p className="text-2xl font-black text-oradent-blue">12</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b font-bold text-oradent-blue">Pending Procedures</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Patient</th>
              <th className="p-4">Treatment</th>
              <th className="p-4">Procedure</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-bold">Ahmed Ali</td>
              <td className="p-4">Root Canal</td>
              <td className="p-4">Nerve Cleaning</td>
              <td className="p-4"><Button variant="outline" className="py-1 px-4 text-xs">View Files</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}