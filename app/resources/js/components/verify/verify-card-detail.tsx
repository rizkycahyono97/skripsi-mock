import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Transaction = {
    block_timestamp: string;
    document_key: string;
    tx_hash: string;
    signer_address: string;
    block_number: string | number;
};

type Document = {
    document_number: string;
};

interface Props {
    transaction: Transaction;
    document: Document;
    fileUrl: string;
}

export default function VerifyCardDetail({
    transaction,
    document,
    fileUrl,
}: Props) {
    const formattedDate = new Date(transaction.block_timestamp).toLocaleString(
        'id-ID',
        {
            dateStyle: 'full',
            timeStyle: 'long',
        },
    );

    return (
        <div className="px-6 py-6 sm:p-8">
            <div className="space-y-6">
                {/* Info Dokumen */}
                <div>
                    <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
                        Informasi Dokumen
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">
                                Nomor Dokumen
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-foreground">
                                {document.document_number}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">
                                Waktu Registrasi (Blockchain)
                            </dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {formattedDate}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Info Kriptografi Blockchain */}
                <div>
                    <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
                        Jejak Kriptografi
                    </h3>
                    <dl className="space-y-4">
                        <div className="rounded-lg bg-muted px-4 py-3 break-all">
                            <dt className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Document Key
                            </dt>
                            <dd className="font-mono text-sm text-foreground">
                                {transaction.document_key}
                            </dd>
                        </div>
                        <div className="rounded-lg bg-muted px-4 py-3 break-all">
                            <dt className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Transaction Hash
                            </dt>
                            <dd className="font-mono text-sm">
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {transaction.tx_hash}
                                </a>
                            </dd>
                        </div>
                        <div className="rounded-lg bg-muted px-4 py-3 break-all">
                            <dt className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Validator Signer (Address)
                            </dt>
                            <dd className="font-mono text-sm text-foreground">
                                {transaction.signer_address}
                            </dd>
                        </div>
                        <div className="rounded-lg bg-muted px-4 py-3">
                            <dt className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Block Number
                            </dt>
                            <dd className="font-mono text-sm text-foreground">
                                #{transaction.block_number}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <Separator className="mt-8 mb-6" />

            <Button asChild className="w-full" size="lg">
                <a href={fileUrl} target="_blank" rel="noreferrer">
                    Lihat Dokumen Asli
                    <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>
    );
}
