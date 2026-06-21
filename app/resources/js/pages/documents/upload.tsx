import { Head, useForm } from '@inertiajs/react';
import React from 'react';

import DocumentUploadForm from '@/components/document/document-upload-form';
import PageHeader from '@/components/global/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        document_number: '',
        document_type: '',
        title: '',
        issued_date: '',
        metadata: [{ key: '', value: '' }],
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/documents', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Tambah Dokumen" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <PageHeader
                        title="Document Upload"
                        description="Kelola, upload, dan validasi dokumen anda disini."
                        actionText="Kembali"
                        actionLink="/documents"
                    />

                    <Card>
                        <CardContent className="p-4 sm:p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <DocumentUploadForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />

                                <div className="flex items-center gap-4 pt-4">
                                    <Button disabled={processing}>
                                        Save Document
                                    </Button>

                                    {processing && (
                                        <span className="text-sm text-muted-foreground">
                                            Menyimpan...
                                        </span>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
