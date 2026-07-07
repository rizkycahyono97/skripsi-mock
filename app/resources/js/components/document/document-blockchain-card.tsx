import { router } from '@inertiajs/react';
import {
    Send,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    document: any;
    blockchainStatus: string;
}

export default function DocumentBlockchainCard({
    document,
    blockchainStatus,
}: Props) {
    const [sending, setSending] = useState(false);

    const handlesignAndIssue = () => {
        setSending(true);
        router.post(
            `/documents/${document.document_uuid}/sign-blockchain`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Dokumen berhasil dikirim ke blockchain!');
                },
                onError: (errors) => {
                    toast.error('Gagal mengirim ke blockchain', {
                        description: Object.values(errors)[0] as string,
                    });
                },
                onFinish: () => setSending(false),
            },
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Integritas & Blockchain</CardTitle>

                {/* BADGE STATUS YANG DINAMIS BERDASARKAN BACKEND */}
                {document.blockchain_transaction && (
                    <>
                        {blockchainStatus === 'valid' && (
                            <Badge className="gap-1 border-green-200 bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                Terverifikasi
                            </Badge>
                        )}
                        {blockchainStatus === 'not_found' && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Tidak Sinkron
                            </Badge>
                        )}
                        {blockchainStatus === 'error' && (
                            <Badge
                                variant="outline"
                                className="gap-1 border-amber-200 text-amber-600 dark:border-amber-900"
                            >
                                <XCircle className="h-3.5 w-3.5 text-amber-500" />
                                Gagal Memeriksa
                            </Badge>
                        )}
                    </>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        File Hash (SHA-256)
                    </p>
                    <p className="rounded bg-muted p-2 font-mono text-xs break-all">
                        {document.file_hash}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">
                        Identity Hash
                    </p>
                    <p className="rounded bg-muted p-2 font-mono text-xs break-all">
                        {document.identity_hash}
                    </p>
                </div>

                {document.blockchain_transaction ? (
                    <div className="mt-4 space-y-3">
                        {/* ALERT BOX BERDASARKAN HASIL COCOK/TIDAKNYA DENGAN JARINGAN */}
                        {blockchainStatus === 'valid' && (
                            <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                <div>
                                    <span className="font-semibold">
                                        Valid:
                                    </span>{' '}
                                    Dokumen ini asli dan telah terverifikasi di
                                    jaringan Blockchain Sepolia.
                                </div>
                            </div>
                        )}

                        {blockchainStatus === 'not_found' && (
                            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <span className="font-semibold">
                                        Peringatan Keras:
                                    </span>{' '}
                                    Transaksi terdaftar di sistem lokal, tetapi
                                    data dokumen tidak ditemukan di dalam smart
                                    contract! Kemungkinan smart contract telah
                                    di-deploy ulang.
                                </div>
                            </div>
                        )}

                        {blockchainStatus === 'error' && (
                            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                                <div>
                                    <span className="font-semibold">
                                        Sistem Sibuk:
                                    </span>{' '}
                                    Gagal melakukan verifikasi langsung ke node
                                    blockchain. Menampilkan data riwayat lokal.
                                </div>
                            </div>
                        )}

                        {/* DETAIL DATA BLOCKCHAIN */}
                        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                            <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
                                Detail Transaksi Blockchain
                            </h3>
                            <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                                <p>
                                    <span className="text-muted-foreground">
                                        TX Hash:
                                    </span>{' '}
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${document.blockchain_transaction.tx_hash}`}
                                        className="font-mono break-all text-blue-600 hover:underline dark:text-blue-400"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {
                                            document.blockchain_transaction
                                                .tx_hash
                                        }
                                    </a>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Block Number:
                                    </span>{' '}
                                    <span className="font-mono">
                                        #
                                        {
                                            document.blockchain_transaction
                                                .block_number
                                        }
                                    </span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Contract Address:
                                    </span>{' '}
                                    <span className="font-mono">
                                        {
                                            document.blockchain_transaction
                                                .contract_address
                                        }
                                    </span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Waktu Konfirmasi:
                                    </span>{' '}
                                    {new Date(
                                        document.blockchain_transaction
                                            .block_timestamp,
                                    ).toLocaleString('id-ID', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-3">
                        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300">
                            Dokumen ini belum tercatat di Blockchain.
                        </div>
                        <Button
                            onClick={handlesignAndIssue}
                            disabled={sending}
                            className="w-full"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Kirim ke Blockchain
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
