import { Clock, Calendar, FileText } from 'lucide-react';

export default function PatientDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-oradent-blue">Welcome back, Patient!</h1>
        <p className="text-gray-500">Here is your dental health summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Calendar className="text-oradent-teal mb-4" />
          <h3 className="text-gray-400 text-xs font-bold uppercase">Next Appointment</h3>
          <p className="text-xl font-bold text-oradent-blue">Oct 24, 2025 - 10:00 AM</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Clock className="text-blue-500 mb-4" />
          <h3 className="text-gray-400 text-xs font-bold uppercase">Last Checkup</h3>
          <p className="text-xl font-bold text-oradent-blue">3 Months Ago</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <FileText className="text-purple-500 mb-4" />
          <h3 className="text-gray-400 text-xs font-bold uppercase">Active Treatments</h3>
          <p className="text-xl font-bold text-oradent-blue">Root Canal (Phase 2)</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-oradent-blue">Recent Medical Records</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase text-gray-400 border-b">
              <th className="p-6">Date</th>
              <th className="p-6">Doctor</th>
              <th className="p-6">Procedure</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-6 font-medium">12/08/2025</td>
              <td className="p-6">Dr. Ali Khan</td>
              <td className="p-6">Scaling & Polishing</td>
              <td className="p-6"><span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}