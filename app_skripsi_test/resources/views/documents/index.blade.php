<x-layouts::app :title="__('Management Documents')">
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <div class="mb-8 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Manajemen Dokumen Digital
                    </h1>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Validasi dokumen akademik via Hyperledger Besu Blockchain.
                    </p>
                </div>

                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Node Status: Connected
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div class="md:col-span-1">
                    <div
                        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="p-6">

                            <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4">
                                Buat Draft Baru
                            </h3>

                            <form action="{{ route('documents.store') }}" method="POST" class="space-y-4">
                                @csrf

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        NIM Mahasiswa
                                    </label>

                                    <input type="text" name="nim"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Contoh: 442023..." required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Perihal Surat
                                    </label>

                                    <input type="text" name="perihal"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Misal: Surat Keterangan Lulus" required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tanggal Surat
                                    </label>

                                    <input type="date" name="tanggal_surat"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required>
                                </div>

                                <button type="submit"
                                    class="w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                    Simpan ke Draft
                                </button>

                            </form>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-2">
                    <div
                        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">

                        <div class="p-6">

                            <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4">
                                Daftar Dokumen Tasdiqi
                            </h3>

                            @if (session('success'))
                                <div
                                    class="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm">
                                    {{ session('success') }}
                                </div>
                            @endif

                            @if (session('error'))
                                <div
                                    class="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm">
                                    {{ session('error') }}
                                </div>
                            @endif

                            <div class="overflow-x-auto">

                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                                    <thead class="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Dokumen
                                            </th>

                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Status
                                            </th>

                                            <th
                                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm">

                                        @forelse($documents as $doc)
                                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">

                                                <td class="px-6 py-4">
                                                    <div class="font-medium text-gray-900 dark:text-gray-100">
                                                        {{ $doc->nomor_surat }}
                                                    </div>

                                                    <div class="text-gray-500 dark:text-gray-400 text-xs">
                                                        {{ $doc->student->name }} ({{ $doc->student->nim }})
                                                    </div>
                                                </td>

                                                <td class="px-6 py-4">

                                                    @if ($doc->status == 'signed')
                                                        <span
                                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            ● Blockchain Signed
                                                        </span>
                                                    @else
                                                        <span
                                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            ○ Pending Sign
                                                        </span>
                                                    @endif

                                                </td>

                                                <td class="px-6 py-4 text-right">

                                                    @if ($doc->status == 'pending')
                                                        <form action="{{ route('documents.setujui', $doc->id) }}"
                                                            method="POST">
                                                            @csrf

                                                            <button type="submit"
                                                                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-semibold">
                                                                Setujui & Sign
                                                            </button>

                                                        </form>
                                                    @else
                                                        <button
                                                            class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded border dark:border-gray-600 text-xs">
                                                            Lihat QR
                                                        </button>
                                                    @endif

                                                </td>

                                            </tr>

                                        @empty

                                            <tr>
                                                <td colspan="3"
                                                    class="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                                                    Belum ada data dokumen.
                                                </td>
                                            </tr>
                                        @endforelse

                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-layouts::app>
