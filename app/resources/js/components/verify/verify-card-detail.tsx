import {
    Check,
    X,
    ExternalLink,
    FileText,
    Database,
    Radio,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { VerifyStatus } from '@/types/verify';

type DetailProps = {
    status: VerifyStatus;
    transaction: {
        document_key: string;
        block_number: string | number;
        tx_hash: string;
    };
    document: {
        document_number: string;
        document_type: string;
        title: string;
        issued_date: string;
    };
    blockchainData?: {
        documentNumber: string;
        identityHash: string;
        fileHash: string;
        signer: string;
        registeredAt: number;
    };
    comparison?: {
        documentNumber: boolean;
        identityHash: boolean;
        fileHash: boolean;
        signer: boolean;
    };
    fileUrl: string | null;
    blockExplorer: string;
};

function Field({
    label,
    value,
    mono = false,
    match,
}: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
    match?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <span className="block text-xs text-zinc-400">{label}</span>
                <span
                    className={`break-all text-zinc-800 dark:text-zinc-200 ${
                        mono ? 'font-mono text-xs' : 'text-sm font-medium'
                    }`}
                >
                    {value}
                </span>
            </div>
            {match !== undefined && <MatchBadge isMatch={match} />}
        </div>
    );
}

function MatchBadge({ isMatch }: { isMatch: boolean }) {
    return isMatch ? (
        <Badge
            variant="outline"
            className="flex shrink-0 items-center gap-1 border-emerald-200 bg-emerald-50 px-2 py-0 text-xs font-normal text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
        >
            <Check className="h-3 w-3" /> Sinkron
        </Badge>
    ) : (
        <Badge
            variant="outline"
            className="flex shrink-0 animate-pulse items-center gap-1 border-red-200 bg-red-50 px-2 py-0 text-xs font-normal text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
        >
            <X className="h-3 w-3" /> Mismatch
        </Badge>
    );
}

export default function VerifyCardDetail({
    status,
    transaction,
    document,
    blockchainData,
    comparison,
    fileUrl,
    blockExplorer,
}: DetailProps) {
    const showMatch = status === 'VALID' || status === 'TAMPERED';

    return (
        <div className="space-y-6 bg-white p-6 dark:bg-zinc-900">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* DATA LOKAL */}
                <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                        <Database className="h-4 w-4 text-indigo-500" />
                        Catatan Database Lokal
                    </h3>
                    <Separator className="dark:bg-zinc-800" />
                    <div className="space-y-3">
                        <Field
                            label="Nomor Dokumen"
                            value={document.document_number}
                            mono
                            match={
                                showMatch
                                    ? comparison?.documentNumber
                                    : undefined
                            }
                        />
                        <Field
                            label="Jenis Dokumen"
                            value={document.document_type}
                        />
                        <Field
                            label="Judul Dokumen"
                            value={document.title ?? '-'}
                        />
                        <Field
                            label="Tanggal Pengesahan"
                            value={document.issued_date}
                        />
                    </div>
                </div>

                {/* DATA BLOCKCHAIN */}
                <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                        <Radio className="h-4 w-4 text-emerald-500" />
                        Jaringan Blockchain (EVM State)
                    </h3>
                    <Separator className="dark:bg-zinc-800" />

                    {blockchainData ? (
                        <div className="space-y-3">
                            <Field
                                label="Nomor Dokumen Terdaftar"
                                value={blockchainData.documentNumber}
                                mono
                                match={
                                    showMatch
                                        ? comparison?.documentNumber
                                        : undefined
                                }
                            />
                            <Field
                                label="Identity Hash (EIP-712 Struct)"
                                value={
                                    <code className="mt-0.5 block rounded bg-zinc-100 p-1.5 dark:bg-zinc-800">
                                        {blockchainData.identityHash}
                                    </code>
                                }
                                mono
                                match={
                                    showMatch
                                        ? comparison?.identityHash
                                        : undefined
                                }
                            />
                            <Field
                                label="File Hash (SHA-256 Dokumen)"
                                value={
                                    <code className="mt-0.5 block rounded bg-zinc-100 p-1.5 dark:bg-zinc-800">
                                        {blockchainData.fileHash}
                                    </code>
                                }
                                mono
                                match={
                                    showMatch ? comparison?.fileHash : undefined
                                }
                            />
                            <Field
                                label="Address Institusi Signer"
                                value={blockchainData.signer}
                                mono
                                match={
                                    showMatch ? comparison?.signer : undefined
                                }
                            />
                            <Field
                                label="Stempel Waktu Blok (Consensus Timestamp)"
                                value={new Date(
                                    blockchainData.registeredAt * 1000,
                                ).toLocaleString('id-ID')}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center py-8 text-center text-xs text-zinc-400 italic">
                            Data on-chain gagal dimuat.
                        </div>
                    )}
                </div>
            </div>

            {/* BUKTI TRANSAKSI */}
            <div className="space-y-3 rounded-xl border border-zinc-100 bg-background p-4 dark:border-zinc-800">
                <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Bukti Resi Transaksi Jaringan
                </h4>
                <div className="grid grid-cols-1 gap-4 font-mono text-xs break-all sm:grid-cols-2">
                    <div>
                        <span className="block font-sans text-zinc-400">
                            Document Key (Index)
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {transaction.document_key}
                        </span>
                    </div>
                    <div>
                        <span className="block font-sans text-zinc-400">
                            Nomor Blok Jaringan
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                            # {transaction.block_number}
                        </span>
                    </div>
                    <div className="sm:col-span-2">
                        <span className="block font-sans text-zinc-400">
                            Tx Hash
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {transaction.tx_hash}
                        </span>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
                {fileUrl && status === 'VALID' && (
                    <Button
                        asChild
                        variant="outline"
                        className="w-full border-zinc-200 sm:w-auto dark:border-zinc-700"
                    >
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                        >
                            <FileText className="h-4 w-4 text-zinc-500" /> Lihat
                            Dokumen Asli
                        </a>
                    </Button>
                )}
                <Button
                    asChild
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 sm:w-auto dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                >
                    <a
                        href={`${blockExplorer}/tx/${transaction.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        Jelajahi Blok Transaksi{' '}
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
