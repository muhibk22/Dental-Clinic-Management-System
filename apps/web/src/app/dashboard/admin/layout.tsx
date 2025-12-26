import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* SIDEBAR - Fixed width, no shrinking */}
      <div className="w-64 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200">
        <Sidebar />
      </div>

      {/* MAIN CONTENT - Using flex-1 and max-w-full to prevent X-scroll */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-10 max-w-[calc(100vw-256px)]">
          {children}
        </div>
      </main>
    </div>
  );
}