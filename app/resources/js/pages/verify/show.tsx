import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import VerifyCardDetail from '@/components/verify/verify-card-detail';
import VerifyCardHeader from '@/components/verify/verify-card-header';
import type { VerifyStatus } from '@/types/verify';

type VerifyQrProps = {
    status: VerifyStatus;
    message: string;
    transaction: {
        document_key: string;
        tx_hash: string;
        block_number: string | number;
    };
    document: {
        document_number: string;
        title: string;
        document_type: string;
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

export default function Show({
    status,
    message,
    transaction,
    document,
    blockchainData,
    comparison,
    fileUrl,
    blockExplorer,
}: VerifyQrProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
            <Head title={`Verifikasi - ${document.document_number}`} />

            <Card className="w-full max-w-4xl gap-0 overflow-hidden border-zinc-200 py-0 shadow-xl dark:border-zinc-800">
                <VerifyCardHeader status={status} message={message} />
                <VerifyCardDetail
                    status={status}
                    transaction={transaction}
                    document={document}
                    blockchainData={blockchainData}
                    comparison={comparison}
                    fileUrl={fileUrl ? `/storage/${fileUrl}` : null}
                    blockExplorer={blockExplorer}
                />
            </Card>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <>{page}</>;
