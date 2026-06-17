import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

import InputError from '@/components/default/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    const addMetadata = () => {
        setData('metadata', [...data.metadata, { key: '', value: '' }]);
    };

    const removeMetadata = (indexToRemove: number) => {
        setData(
            'metadata',
            data.metadata.filter((_, index) => index !== indexToRemove),
        );
    };

    const updateMetadata = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        const newMetadata = [...data.metadata];
        newMetadata[index][field] = value;
        setData('metadata', newMetadata);
    };

    return (
        <>
            <Head title="Tambah Dokumen" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        {/* FORM DIMULAI DI SINI */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Grid Layout untuk 2 kolom (Opsional, tapi rapi) */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Input: Nomor Dokumen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="document_number">
                                        Nomor Dokumen
                                    </Label>
                                    <Input
                                        id="document_number"
                                        className="mt-1 block w-full"
                                        value={data.document_number}
                                        onChange={(e: any) =>
                                            setData(
                                                'document_number',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Contoh: DOC/2026/001"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.document_number}
                                    />
                                </div>

                                {/* Input: Jenis Dokumen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="document_type">
                                        Jenis Dokumen
                                    </Label>
                                    <select
                                        id="document_type"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        value={data.document_type}
                                        onChange={(e) =>
                                            setData(
                                                'document_type',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Pilih Jenis...</option>
                                        <option value="ijazah">Ijazah</option>
                                        <option value="transkrip-nilai">
                                            Transkrip Nilai
                                        </option>
                                        <option value="surat-keterangan-lulus">
                                            Surat Keterangan Lulus
                                        </option>
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.document_type}
                                    />
                                </div>
                            </div>

                            {/* Input: Judul Dokumen */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Judul Dokumen</Label>
                                <Input
                                    id="title"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e: any) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                    placeholder="Contoh: Ijazah - Nama Mahasiswa"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.title}
                                />
                            </div>

                            {/* Input: Tanggal Terbit */}
                            <div className="grid gap-2">
                                <Label htmlFor="issued_date">
                                    Tanggal Terbit
                                </Label>
                                <Input
                                    id="issued_date"
                                    type="date"
                                    className="mt-1 block w-full sm:w-1/2"
                                    value={data.issued_date}
                                    onChange={(e: any) =>
                                        setData('issued_date', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.issued_date}
                                />
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            {/* Section: Metadata */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Informasi Tambahan (Metadata)</Label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={addMetadata}
                                        className="h-8 text-xs"
                                    >
                                        <Plus className="mr-1 h-3 w-3" /> Tambah
                                        Baris
                                    </Button>
                                </div>

                                <div className="grid gap-3">
                                    {data.metadata.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Input
                                                className="w-1/3"
                                                placeholder="Key (misal: nim)"
                                                value={item.key}
                                                onChange={(e: any) =>
                                                    updateMetadata(
                                                        index,
                                                        'key',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Input
                                                className="flex-1"
                                                placeholder="Value (misal: 12345678)"
                                                value={item.value}
                                                onChange={(e: any) =>
                                                    updateMetadata(
                                                        index,
                                                        'value',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {data.metadata.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeMetadata(index)
                                                    }
                                                    className="p-2 text-gray-400 transition-colors hover:text-red-500"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <InputError
                                    className="mt-2"
                                    message={errors.metadata}
                                />
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            {/* Input: File PDF */}
                            <div className="grid gap-2">
                                <Label htmlFor="file">File Dokumen (PDF)</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf"
                                    className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                                    onChange={(e: any) =>
                                        setData(
                                            'file',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.file}
                                />
                            </div>

                            {/* Tombol Submit (Sesuai dengan gaya contoh Anda) */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button disabled={processing}>
                                    Save Document
                                </Button>

                                {/* Indikator kecil saat loading */}
                                {processing && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Menyimpan...
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
