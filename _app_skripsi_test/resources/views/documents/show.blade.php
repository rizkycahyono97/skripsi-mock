<x-layouts::app :title="__('Show Documents')">

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">

            <div class="mb-6 flex justify-between items-start">
                <div>
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Detail Dokumen</h2>
                    <p class="text-sm text-gray-500">ID Internal: #{{ $document->id }}</p>
                </div>
                <div class="text-right">
                    @if ($document->status == 'signed')
                        <span
                            class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            TERVERIFIKASI BLOCKCHAIN
                        </span>
                    @else
                        <span
                            class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            MENUNGGU TANDA TANGAN
                        </span>
                    @endif
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div class="md:col-span-2 space-y-6">
                    <div
                        class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div
                            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 class="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-xs">
                                Informasi Akademik</h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs text-gray-400 uppercase">Nomor Surat</label>
                                    <p class="font-semibold text-gray-900 dark:text-white">{{ $document->nomor_surat }}
                                    </p>
                                </div>
                                <div>
                                    <label class="text-xs text-gray-400 uppercase">Biro Penanda Tangan</label>
                                    <p class="font-semibold text-gray-900 dark:text-white">
                                        {{ $document->biro->nama_biro }}</p>
                                </div>
                                <div>
                                    <label class="text-xs text-gray-400 uppercase">Nama Mahasiswa</label>
                                    <p class="font-semibold text-gray-900 dark:text-white">
                                        {{ $document->student->name }}</p>
                                </div>
                                <div>
                                    <label class="text-xs text-gray-400 uppercase">NIM</label>
                                    <p class="font-semibold text-gray-900 dark:text-white">
                                        {{ $document->student->nim }}</p>
                                </div>
                            </div>
                            <hr class="dark:border-gray-700">
                            <div>
                                <label class="text-xs text-gray-400 uppercase">Perihal</label>
                                <p class="text-gray-900 dark:text-white">{{ $document->perihal }}</p>
                            </div>
                        </div>
                    </div>

                    @if ($document->status == 'signed')
                        <div
                            class="bg-indigo-50 dark:bg-indigo-900/20 shadow rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <div
                                class="px-6 py-4 border-b border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
                                <h3
                                    class="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-xs">
                                    Blockchain Proof of Authenticity</h3>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg"
                                    width="80">
                            </div>
                            <div class="p-6 space-y-4">
                                <div>
                                    <label class="text-[10px] text-indigo-400 uppercase font-bold">Transaction Hash
                                        (TxID)</label>
                                    <p
                                        class="font-mono text-xs break-all text-indigo-900 dark:text-indigo-200 bg-white dark:bg-black/30 p-2 rounded mt-1 border border-indigo-100 dark:border-indigo-900">
                                        {{ $document->blockchain_tx_hash }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-[10px] text-indigo-400 uppercase font-bold">Signer
                                            Address</label>
                                        <p class="font-bold text-indigo-900 dark:text-indigo-200">
                                            {{ $document->biro->nama_biro }}</p>
                                    </div>
                                    <div>
                                        <label class="text-[10px] text-indigo-400 uppercase font-bold">Status</label>
                                        <p class="font-bold text-indigo-900 dark:text-indigo-200">
                                            {{ $document->status }}</p>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-[10px] text-indigo-400 uppercase font-bold">Signer Wallet Address
                                        (Biro)</label>
                                    <p class="font-mono text-xs text-indigo-800 dark:text-indigo-300">
                                        {{ $document->signer_address }}</p>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>

                <div class="md:col-span-1 space-y-6">
                    <div
                        class="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        @if ($document->status == 'signed')
                            <label class="text-xs text-gray-400 uppercase mb-4 block">QR Verification</label>
                            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg inline-block mb-4">
                                {{-- {!! QrCode::size(150)->generate(route('verify', $document->blockchain_tx_hash)) !!} --}}
                            </div>
                            <p class="text-[10px] text-gray-500 italic">Scan untuk memvalidasi keaslian dokumen via
                                Public Portal</p>
                        @else
                            <div class="py-12 flex flex-col items-center justify-center space-y-3">
                                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                    </path>
                                </svg>
                                <p class="text-xs text-gray-400 italic">QR Code tersedia setelah dokumen ditandatangani
                                </p>
                            </div>
                        @endif
                    </div>

                    <div class="flex flex-col gap-2">
                        <a href="{{ route('documents.index') }}"
                            class="text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-semibold hover:bg-gray-300 transition">
                            Kembali
                        </a>
                        @if ($document->status == 'signed')
                            <button
                                class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition">
                                Cetak PDF Berstempel Digital
                            </button>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-layouts::app>
