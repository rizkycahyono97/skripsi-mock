import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { index } from '@/routes/users';

export default function UserProfileHeader() {
    return (
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-lg">Informasi Pengguna</CardTitle>
                <CardDescription>
                    Detail akun dan kredensial digital.
                </CardDescription>
            </div>
            {/* <Button variant="ghost" size="sm" asChild>
                <Link href={index()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </Button> */}
        </CardHeader>
    );
}
