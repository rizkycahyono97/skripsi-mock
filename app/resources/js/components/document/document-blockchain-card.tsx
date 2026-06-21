import { router } from '@inertiajs/react';
import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    document: any;
}

export default function DocumentBlockchainCard({ document }: Props) {
    const [sending, setSending] = useState(false);

    const handleSendToBlockchain = () => {
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
            <CardHeader>
                <CardTitle>Integritas & Blockchain</CardTitle>
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
                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                            Tercatat di Blockchain
                        </h3>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    TX Hash:
                                </span>{' '}
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${document.blockchain_transaction.tx_hash}`}
                                    className="break-all text-blue-600 hover:underline dark:text-blue-400"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {document.blockchain_transaction.tx_hash}
                                </a>
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Block:
                                </span>{' '}
                                {document.blockchain_transaction.block_number}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Contract:
                                </span>{' '}
                                {
                                    document.blockchain_transaction
                                        .contract_address
                                }
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Waktu Konfirmasi:
                                </span>{' '}
                                {new Date(
                                    document.blockchain_transaction
                                        .block_timestamp,
                                ).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-3">
                        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300">
                            Dokumen ini belum tercatat di Blockchain.
                        </div>
                        <Button
                            onClick={handleSendToBlockchain}
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
