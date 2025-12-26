import { ClipboardList, User } from 'lucide-react';

export default function AssistantDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-oradent-blue">Assistant Portal [cite: 23]</h1>

      <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
        <div className="flex items-center gap-4">
          <ClipboardList className="text-oradent-teal" />
          <p className="text-sm font-medium text-oradent-blue">
            Note: You can manage treatment tasks but cannot modify billing records.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-oradent-blue mb-4 uppercase tracking-tighter text-sm">Assigned Tasks [cite: 13, 173]</h2>
        <div className="space-y-3">
          <div className="p-4 border rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-oradent-teal"></div>
              <p className="text-sm font-bold">Prepare Surgery Room [cite: 30]</p>
            </div>
            <span className="text-xs font-bold text-gray-400">Treatment #402 [cite: 116]</span>
          </div>
        </div>
      </div>
    </div>
  );
}