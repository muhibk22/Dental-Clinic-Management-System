import AdminSidebar from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function DashboardLayout({
    children,
    title,
    subtitle,
    actions
}: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                    <div className="px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="pl-12 lg:pl-0">
                                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                                )}
                            </div>
                            {actions && (
                                <div className="flex items-center gap-3">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
