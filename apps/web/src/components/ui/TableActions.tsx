"use client";

interface TableActionsProps {
    children: React.ReactNode;
}

export default function TableActions({ children }: TableActionsProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            {children}
        </div>
    );
}
