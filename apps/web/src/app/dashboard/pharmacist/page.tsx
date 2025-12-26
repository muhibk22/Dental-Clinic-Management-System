import { Pill, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PharmacistDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-oradent-blue">Pharmacy Inventory [cite: 16]</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-oradent-teal rounded-2xl"><CheckCircle /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Available Items [cite: 143, 185]</p>
            <p className="text-2xl font-black">142</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Low Stock </p>
            <p className="text-2xl font-black">8</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b font-bold text-oradent-blue">Stock Management [cite: 182]</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Medicine [cite: 140]</th>
              <th className="p-4">Quantity [cite: 141]</th>
              <th className="p-4">Price [cite: 142]</th>
              <th className="p-4">Status [cite: 143]</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-bold">Amoxicillin</td>
              <td className="p-4">50 units [cite: 184]</td>
              <td className="p-4">Rs. 450 [cite: 184]</td>
              <td className="p-4"><span className="text-teal-600 font-bold">In Stock [cite: 185]</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}