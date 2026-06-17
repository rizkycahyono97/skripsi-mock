import { FolderOpen } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title = 'Data Tidak Ditemukan',
    description = 'Silakan tentukan filter atau tambahkan data baru terlebih dahulu.',
    icon,
}: EmptyStateProps) {
    return (
        <div className="animate-fadeIn flex w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-6 py-16 text-center">
            <div className="mb-4 rounded-full border border-border bg-background p-4 text-foreground">
                {icon || <FolderOpen className="h-8 w-8 stroke-[1.5]" />}
            </div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-foreground">
                {description}
            </p>
        </div>
    );
}
