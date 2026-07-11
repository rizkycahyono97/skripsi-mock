import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import VerifyUploadForm from '@/components/verify/verify-upload-form';

export default function UploadManual() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
            <Head title="Verifikasi Manual Dokumen" />

            <Card className="w-full max-w-xl border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <CardHeader className="space-y-1 border-b border-zinc-100 pb-6 text-center dark:border-zinc-800">
                    <CardTitle className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                        Verifikasi Manual Kriptografi
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-sm text-zinc-500">
                        Unggah berkas PDF asli Anda untuk dihitung sidik jari
                        digitalnya dan divalidasi dengan Ledger Blockchain.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <VerifyUploadForm />
                </CardContent>
            </Card>
        </div>
    );
}

UploadManual.layout = (page: React.ReactNode) => <>{page}</>;
