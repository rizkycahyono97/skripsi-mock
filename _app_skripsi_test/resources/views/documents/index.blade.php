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
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200">
                    Node Status: Connected
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div class="md:col-span-1">
                    <div
                        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="p-6">
                            <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4"></path>
                                </svg>
                                Buat Draft Baru
                            </h3>

                            <form action="{{ route('documents.store') }}" method="POST" class="space-y-4">
                                @csrf

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIM
                                        Mahasiswa</label>
                                    <input type="text" name="nim"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="442023..." required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tujuan
                                        Biro Penanda Tangan</label>
                                    <select name="biro_id"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required>
                                        <option value="">-- Pilih Biro --</option>
                                        @foreach ($biros as $biro)
                                            <option value="{{ $biro->id }}">{{ $biro->nama_biro }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Perihal
                                        Surat</label>
                                    <input type="text" name="perihal"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Surat Keterangan Lulus" required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal
                                        Surat</label>
                                    <input type="date" name="tanggal_surat"
                                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required>
                                </div>

                                <button type="submit"
                                    class="w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition">
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
                            <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4">Daftar Dokumen
                                Tasdiqi</h3>

                            @if (session('success'))
                                <div
                                    class="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm rounded">
                                    {{ session('success') }}
                                </div>
                            @endif

                            @if (session('error'))
                                <div
                                    class="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm rounded">
                                    {{ session('error') }}
                                </div>
                            @endif

                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Dokumen</th>
                                            <th
                                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Biro</th>
                                            <th
                                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                                                Status</th>
                                            <th
                                                class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Aksi</th>
                                            <th
                                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                                                Show</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                        @forelse($documents as $doc)
                                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                                <td class="px-4 py-4">
                                                    <div class="font-bold text-gray-900 dark:text-gray-100">
                                                        {{ $doc->nomor_surat }}</div>
                                                    <div class="text-gray-500 dark:text-gray-400 text-xs">
                                                        {{ $doc->student->name }} ({{ $doc->student->nim_student }})
                                                    </div>
                                                </td>

                                                <td class="px-4 py-4">
                                                    <span
                                                        class="text-xs font-semibold text-gray-600 dark:text-gray-400 italic">
                                                        {{ $doc->biro->nama_biro ?? 'Biro tidak terdeteksi' }}
                                                    </span>
                                                </td>

                                                <td class="px-4 py-4 text-center">
                                                    @if ($doc->status == 'signed')
                                                        <span
                                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 uppercase">
                                                            Blockchain Signed
                                                        </span>
                                                    @else
                                                        <span
                                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 uppercase">
                                                            Pending Sign
                                                        </span>
                                                    @endif
                                                </td>

                                                <td class="px-4 py-4 text-right">
                                                    @if ($doc->status == 'pending')
                                                        <form action="{{ route('documents.setujui', $doc->id) }}"
                                                            method="POST">
                                                            @csrf
                                                            <button type="submit"
                                                                class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition">
                                                                SIGN & APPROVE
                                                            </button>
                                                        </form>
                                                    @else
                                                        <div class="flex justify-end gap-2">
                                                            {{-- <span
                                                                class="text-[10px] text-gray-400 block mb-1 font-mono">Tx:
                                                                {{ Str::limit($doc->blockchain_tx_hash, 10) }}</span> --}}
                                                            <button
                                                                class="bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 px-3 py-1 rounded text-xs font-bold shadow-sm">
                                                                LIHAT QR
                                                            </button>
                                                        </div>
                                                    @endif
                                                </td>

                                                <td class="px-4 py-4 text-right">
                                                    @if ($doc->status == 'signed')
                                                        <form action="{{ route('documents.show', $doc->id) }}"
                                                            method="GET">
                                                            @csrf
                                                            <button type="submit"
                                                                class="bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition">
                                                                SHOW
                                                            </button>
                                                        </form>
                                                    @endif
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="4"
                                                    class="px-6 py-10 text-center text-gray-400 dark:text-gray-500 italic">
                                                    Belum ada data dokumen yang diajukan.
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

{{-- <script>
    document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', e => {
            console.log('FORM SUBMIT:', f.action, f.method);
        });
    });
</script> --}}
