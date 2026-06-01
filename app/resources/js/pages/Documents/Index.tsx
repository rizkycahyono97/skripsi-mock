import { Head, Link } from '@inertiajs/react';
import React from 'react';
// import type { Auth } from '@/types';

// type PageProps = {
//     auth: Auth;
// };

export default function Index({ documents }: { documents: any }) {
    // const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Document" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header / Tombol Aksi (Opsional) */}
                            <div className="mb-4 flex justify-end">
                                {/* Tempat untuk tombol "Tambah Dokumen" nantinya */}
                            </div>

                            {/* Tabel Data */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                No. Dokumen
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Judul & Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Tipe / Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Blockchain Tx
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {documents.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    Tidak ada dokumen yang
                                                    ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            documents.data.map((doc: any) => (
                                                <tr key={doc.id}>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                        {doc.document_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {doc.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            NIM:{' '}
                                                            {doc.metadata
                                                                ?.student_nim ||
                                                                '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                                                            {doc.document_type}
                                                        </span>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {doc.status}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        {doc.blockchain_transaction ? (
                                                            <span
                                                                title={
                                                                    doc
                                                                        .blockchain_transaction
                                                                        .tx_hash
                                                                }
                                                                className="cursor-help font-mono text-xs text-green-600"
                                                            >
                                                                {doc.blockchain_transaction.tx_hash.substring(
                                                                    0,
                                                                    10,
                                                                )}
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Navigasi Pagination */}
                            {/* Navigasi Pagination */}
                            <div className="mt-6 flex justify-center">
                                {documents.links.map(
                                    (link: any, index: number) => {
                                        // Jika link.url null (contoh: tombol Previous di halaman 1)
                                        // Render sebagai span biasa yang tidak bisa diklik
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="mx-1 cursor-not-allowed rounded border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-400 opacity-50"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            );
                                        }

                                        // Jika link.url ada, render sebagai Link Inertia
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`mx-1 rounded border px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                preserveState
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
