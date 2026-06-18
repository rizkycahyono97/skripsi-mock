import { Head, Link } from '@inertiajs/react';
import React from 'react';
// Import layout bawaan Anda jika ada, misal AuthenticatedLayout
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ document }: { document: any }) {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <Head title={`Dokumen: ${document.title}`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {document.title}
                    </h1>
                    <Link
                        // href={route('documents.index')}
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Kolom Kiri: Info Utama & File (Lebar 2/3) */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Card Info Utama */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                Informasi Dokumen
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Nomor Dokumen
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {document.document_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tipe Dokumen
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {document.document_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tanggal Terbit
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(
                                            document.issued_date,
                                        ).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Status
                                    </p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                            document.status === 'verified'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {document.status.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Dibuat Oleh
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {document.creator?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card Data Kriptografi & Blockchain */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                Integritas & Blockchain
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        File Hash (SHA-256)
                                    </p>
                                    <p className="rounded bg-gray-50 p-2 font-mono text-xs break-all">
                                        {document.file_hash}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Identity Hash
                                    </p>
                                    <p className="rounded bg-gray-50 p-2 font-mono text-xs break-all">
                                        {document.identity_hash}
                                    </p>
                                </div>

                                {document.blockchain_transaction ? (
                                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                                        <h3 className="mb-2 font-semibold text-blue-800">
                                            Tercatat di Blockchain
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <p>
                                                <span className="text-gray-600">
                                                    TX Hash:
                                                </span>{' '}
                                                <a
                                                    href={`https://sepolia.etherscan.io/tx/${document.blockchain_transaction.tx_hash}`}
                                                    className="break-all text-blue-600 hover:underline"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {
                                                        document
                                                            .blockchain_transaction
                                                            .tx_hash
                                                    }
                                                </a>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">
                                                    Block:
                                                </span>{' '}
                                                {
                                                    document
                                                        .blockchain_transaction
                                                        .block_number
                                                }
                                            </p>
                                            <p>
                                                <span className="text-gray-600">
                                                    Contract:
                                                </span>{' '}
                                                {
                                                    document
                                                        .blockchain_transaction
                                                        .contract_address
                                                }
                                            </p>
                                            <p>
                                                <span className="text-gray-600">
                                                    Waktu Konfirmasi:
                                                </span>{' '}
                                                {new Date(
                                                    document
                                                        .blockchain_transaction
                                                        .confirmed_at,
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                                        Dokumen ini belum tercatat di
                                        Blockchain.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: File & Log (Lebar 1/3) */}
                    <div className="space-y-6">
                        {/* Card File Dokumen */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                File Terlampir
                            </h2>
                            {document.files && document.files.length > 0 ? (
                                <ul className="space-y-3">
                                    {document.files.map((file) => (
                                        <li
                                            key={file.id}
                                            className="flex flex-col gap-2 rounded border bg-gray-50 p-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Ukuran:{' '}
                                                    {(
                                                        file.file_size / 1024
                                                    ).toFixed(2)}{' '}
                                                    KB
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={`/storage/${file.original_file}`}
                                                    target="_blank"
                                                    className="text-sm text-indigo-600 hover:underline"
                                                >
                                                    Download Asli
                                                </a>
                                                {file.verified_file && (
                                                    <a
                                                        href={`/storage/${file.verified_file}`}
                                                        target="_blank"
                                                        className="text-sm text-green-600 hover:underline"
                                                    >
                                                        Download Tanda Tangan
                                                    </a>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Tidak ada file terlampir.
                                </p>
                            )}
                        </div>

                        {/* Card Audit Log */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                Riwayat Aktivitas
                            </h2>
                            {document.audit_logs &&
                            document.audit_logs.length > 0 ? (
                                <div className="max-h-64 space-y-4 overflow-y-auto pr-2">
                                    {document.audit_logs.map((log) => (
                                        <div key={log.id} className="text-sm">
                                            <p className="font-semibold text-gray-800">
                                                {log.action}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Oleh:{' '}
                                                {log.user?.name || 'Sistem'} •{' '}
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Belum ada riwayat aktivitas.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
