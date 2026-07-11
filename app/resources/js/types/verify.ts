import {
    CheckCircle2,
    ShieldAlert,
    ShieldQuestion,
    ServerCrash,
    type LucideIcon,
} from 'lucide-react';

export type VerifyStatus =
    | 'VALID'
    | 'TAMPERED'
    | 'BLOCKCHAIN_NOT_FOUND'
    | 'SERVER_ERROR';

type StatusConfig = {
    icon: LucideIcon;
    label: string;
    headerClass: string;
    iconWrapClass: string;
    iconClass: string;
    ringClass: string;
};

export const statusConfig: Record<VerifyStatus, StatusConfig> = {
    VALID: {
        icon: CheckCircle2,
        label: 'Dokumen Terverifikasi',
        headerClass: 'bg-emerald-600 dark:bg-emerald-700',
        iconWrapClass: 'bg-emerald-100 dark:bg-emerald-900/50',
        iconClass: 'text-emerald-600 dark:text-emerald-400',
        ringClass: 'ring-emerald-200 dark:ring-emerald-800',
    },
    TAMPERED: {
        icon: ShieldAlert,
        label: 'Dokumen Tidak Sesuai',
        headerClass: 'bg-red-600 dark:bg-red-700',
        iconWrapClass: 'bg-red-100 dark:bg-red-900/50',
        iconClass: 'text-red-600 dark:text-red-400',
        ringClass: 'ring-red-200 dark:ring-red-800',
    },
    BLOCKCHAIN_NOT_FOUND: {
        icon: ShieldQuestion,
        label: 'Data Tidak Ditemukan',
        headerClass: 'bg-amber-500 dark:bg-amber-600',
        iconWrapClass: 'bg-amber-100 dark:bg-amber-900/50',
        iconClass: 'text-amber-600 dark:text-amber-400',
        ringClass: 'ring-amber-200 dark:ring-amber-800',
    },
    SERVER_ERROR: {
        icon: ServerCrash,
        label: 'Terjadi Kesalahan',
        headerClass: 'bg-zinc-700 dark:bg-zinc-800',
        iconWrapClass: 'bg-zinc-200 dark:bg-zinc-800',
        iconClass: 'text-zinc-600 dark:text-zinc-300',
        ringClass: 'ring-zinc-300 dark:ring-zinc-700',
    },
};
