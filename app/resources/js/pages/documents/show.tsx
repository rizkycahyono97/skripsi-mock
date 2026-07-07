import { Head } from '@inertiajs/react';
import DocumentAuditLogCard from '@/components/document/document-audit-logs';
import DocumentBlockchainCard from '@/components/document/document-blockchain-card';
import DocumentFilesCard from '@/components/document/document-files-card';
import DocumentInfoCard from '@/components/document/document-info-card';
import PageHeader from '@/components/global/page-header';

interface Props {
    document: any;
    blockchainStatus: string;
}

export default function Show({ document, blockchainStatus }: Props) {
    return (
        <div className="min-h-screen bg-background py-8">
            <Head title={`Dokumen: ${document.title}`} />

            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader
                    title="Documents Show"
                    description="Kirim dokumen ke blockchain dan lihat detail dokumen"
                    actionText="Kembali"
                    actionLink="/documents"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <DocumentInfoCard document={document} />
                        <DocumentBlockchainCard
                            document={document}
                            blockchainStatus={blockchainStatus}
                        />
                    </div>

                    <div className="space-y-6">
                        <DocumentFilesCard files={document.file} />
                        {/* <DocumentAuditLogCard auditLogs={document.audit_logs} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
