import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save, UploadCloud } from 'lucide-react';
import React from 'react';

import DocumentUploadForm from '@/components/document/document-upload-form';
import PageHeader from '@/components/global/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <PageHeader
                        title="Document Upload"
                        description="Kelola, upload, dan validasi dokumen anda disini."
                        actionText="Kembali"
                        actionLink="/documents"
                    />

                    <Card className="mt-6 border-zinc-200 shadow-sm dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center gap-3 border-b border-zinc-100 bg-zinc-50/50 py-5 dark:border-zinc-800 dark:bg-zinc-900/40">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <UploadCloud className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                    Detail Dokumen
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Lengkapi data di bawah, lalu unggah berkas
                                    PDF sumbernya.
                                </p>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-8">
                            <form onSubmit={submit} className="space-y-8">
                                <DocumentUploadForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />

                                <Separator className="dark:bg-zinc-800" />

                                <div className="flex items-center justify-end gap-3">
                                    {processing && (
                                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            Menyimpan dokumen...
                                        </span>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        Save Document
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
