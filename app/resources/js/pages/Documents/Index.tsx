import { Head } from '@inertiajs/react';
import { MoreVertical, Download, Plus } from 'lucide-react';
import React from 'react';
import Pagination from '@/components/pagination';
import { index } from '@/routes/documents';
// import type { Auth } from '@/types';

// type PageProps = {
//     auth: Auth;
// };

export default function Index({ documents }: { documents: any }) {
    return (
        <>
            <Head title="Document" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row dark:bg-gray-800">
                        {/* Area Filter & Search */}
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <input
                                type="text"
                                placeholder="Cari dokumen, NIM, dll..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-64 sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            />
                            <div className="flex gap-2">
                                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                    <option value="">Semua Tipe</option>
                                    <option value="ijazah">Ijazah</option>
                                    <option value="transkrip">
                                        Transkrip Nilai
                                    </option>
                                </select>
                                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                    <option value="">Semua Status</option>
                                    <option value="draft">Draft</option>
                                    <option value="signed">Signed</option>
                                </select>
                            </div>
                        </div>

                        {/* Area Tombol Aksi */}
                        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </button>
                            <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800">
                                <Plus className="mr-2 h-4 w-4" /> Tambah
                            </button>
                        </div>
                    </div>

                    {/* Tabel Utama */}
                    <div className="overflow-hidden bg-white text-gray-900 shadow-sm sm:rounded-lg dark:bg-gray-800 dark:text-gray-100">
                        <div className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                No. Dokumen
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Judul
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Tipe
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Blockchain Tx
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {documents.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    Tidak ada dokumen yang
                                                    ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            documents.data.map((doc: any) => (
                                                <tr
                                                    key={doc.id}
                                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {doc.document_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {doc.title}
                                                        </div>
                                                        {/* <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            NIM:{' '}
                                                            {doc.metadata
                                                                ?.student_nim ||
                                                                '-'}
                                                        </div> */}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                            {doc.document_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                                doc.status ===
                                                                    'Signed' ||
                                                                doc.status ===
                                                                    'Published'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            }`}
                                                        >
                                                            {doc.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                        {doc.blockchain_transaction ? (
                                                            <span
                                                                title={
                                                                    doc
                                                                        .blockchain_transaction
                                                                        .tx_hash
                                                                }
                                                                className="cursor-help font-mono text-xs text-green-600 dark:text-green-400"
                                                            >
                                                                {doc.blockchain_transaction.tx_hash.substring(
                                                                    0,
                                                                    10,
                                                                )}
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </td>
                                                    {/* Kolom Aksi dengan Hover Dropdown */}
                                                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                                                        <div className="group relative inline-block text-left">
                                                            <button className="flex w-full items-center justify-center p-2 text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </button>

                                                            {/* Dropdown Menu - Muncul saat di-hover */}
                                                            <div className="ring-opacity-5 absolute top-0 right-8 z-50 hidden w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black group-hover:block focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
                                                                <div className="py-1">
                                                                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                                                                        Lihat
                                                                        Detail
                                                                    </button>
                                                                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                                                                        Validasi
                                                                        (Arsip)
                                                                    </button>
                                                                    <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600">
                                                                        Hapus
                                                                        Dokumen
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Memanggil Komponen Pagination */}
                            <Pagination links={documents.links} />
                        </div>
                    </div>
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
