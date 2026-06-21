import { CheckCircle2 } from 'lucide-react';

export default function VerifyCardHeader() {
    return (
        <div className="bg-green-600 px-6 py-8 text-center dark:bg-green-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
                Dokumen Valid & Terverifikasi
            </h2>
            <p className="mt-2 text-green-100">Tasdiqi Blockchain Network</p>
        </div>
    );
}
