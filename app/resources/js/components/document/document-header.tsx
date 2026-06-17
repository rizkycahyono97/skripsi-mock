import { Users, Download, Plus, Filter, Search } from 'lucide-react';
import React, { useState } from 'react';
import type { DocumentHeaderProps } from '@/types/document';

export default function DocumentHeader({
    totalDocuments = 0,
}: DocumentHeaderProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="mb-6 flex flex-col gap-4">
            {/* BARIS 1: Judul Besar & Tombol Aksi (Sesuai Gambar) */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {/* Kiri: Judul & Total */}
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Documents
                    </h1>
                    <div className="mt-1 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        <Users className="mr-1.5 h-4 w-4" />
                        <span>
                            Total: {totalDocuments.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Kanan: Tombol Export & Add */}
                <div className="flex w-full items-center gap-3 sm:w-auto">
                    <button className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:flex-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900">
                        <Download className="mr-2 h-4 w-4" /> Export data
                    </button>
                    <button className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:flex-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-900">
                        <Plus className="mr-2 h-4 w-4" /> Add document
                    </button>
                </div>
            </div>

            {/* BARIS 2: Toolbar Pencarian & Toggle Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Input Pencarian Selalu Tampil */}
                <div className="relative w-full sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search documents, NIM..."
                        className="block w-full rounded-md border-gray-300 py-2 pl-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-indigo-600"
                    />
                </div>

                {/* Tombol untuk memunculkan filter lanjutan */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none ${
                        showFilters
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    All filters
                </button>
            </div>

            {/* BARIS 3: Area Filter Dropdown (Hidden by default) */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="w-full sm:w-48">
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            Tipe Dokumen
                        </label>
                        <select className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <option value="">Semua Tipe</option>
                            <option value="ijazah">Ijazah</option>
                            <option value="transkrip">Transkrip Nilai</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            Status Validasi
                        </label>
                        <select className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="signed">Signed</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
