import { Head } from '@inertiajs/react';
import DocumentHeader from '@/components/document/document-header';
import DocumentTable from '@/components/document/document-table';
import Pagination from '@/components/global/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/documents';

export default function Index({ documents }: { documents: any }) {
    return (
        <>
            <Head title="Document" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <DocumentHeader totalDocuments={documents.total} />

                    <Card>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <DocumentTable documents={documents.data} />
                            </div>
                            <Pagination links={documents.links} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Document',
            href: index(),
        },
    ],
};
