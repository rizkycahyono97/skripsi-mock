import { useForm } from '@inertiajs/react';
import { FileUp, FileText, AlertCircle, Loader2 } from 'lucide-react';
import type { DragEvent, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { verifyUploadStore } from '@/routes/documents';

export default function VerifyUploadForm() {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setData('file', file);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            // Validasi ekstensi harus PDF
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setData('file', file);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setData('file', null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.file) {
            return;
        }

        post(verifyUploadStore(data.file), {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert dari Backend Validation */}
            {errors.file && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">
                        Gagal Memproses
                    </AlertTitle>
                    <AlertDescription>{errors.file}</AlertDescription>
                </Alert>
            )}

            {/* AREA DRAG & DROP FILE */}
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragActive
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                        : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30'
                }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={processing}
                />

                {!selectedFile ? (
                    <>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            <FileUp className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Tarik & lepas file PDF di sini, atau{' '}
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer font-semibold text-indigo-600 underline underline-offset-4 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                pilih file
                            </label>
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                            Hanya mendukung format berkas .pdf (Maks. 10MB)
                        </p>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="max-w-xs space-y-1">
                            <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {selectedFile.name}
                            </p>
                            <p className="font-mono text-xs text-zinc-400">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)}{' '}
                                MB
                            </p>
                        </div>

                        {!processing && (
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="mt-3 text-xs font-medium text-red-500 underline hover:text-red-600"
                            >
                                Ganti Berkas
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* TOMBOL SUBMIT */}
            <Button
                type="submit"
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                disabled={!selectedFile || processing}
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghitung SHA-256 & Menghubungi Blockchain...
                    </>
                ) : (
                    'Mulai Verifikasi Berkas'
                )}
            </Button>
        </form>
    );
}
