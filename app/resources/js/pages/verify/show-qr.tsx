import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import VerifyCardDetail from '@/components/verify/verify-card-detail';
import VerifyCardHeader from '@/components/verify/verify-card-header';

type VerifyQrProps = {
    transaction: {
        block_timestamp: string;
        document_key: string;
        tx_hash: string;
        signer_address: string;
        block_number: string | number;
    };
    document: {
        document_number: string;
    };
    fileUrl: string;
    blockExproler: string;
};

export default function ShowQr({
    transaction,
    document,
    fileUrl,
    blockExproler,
}: VerifyQrProps) {
    // console.log(fileUrl);
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <Head title={`Verifikasi - ${document.document_number}`} />

            <Card className="w-full max-w-2xl overflow-hidden p-0">
                <VerifyCardHeader />
                <VerifyCardDetail
                    transaction={transaction}
                    document={document}
                    fileUrl={`/storage/${fileUrl}`}
                    blockExproler={blockExproler}
                />
            </Card>
        </div>
    );
}

ShowQr.layout = (page: React.ReactNode) => <>{page}</>;
