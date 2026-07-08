import { Head } from '@inertiajs/react';
import PageHeader from '@/components/global/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import UserForm from '@/components/users/user-form';

interface UserData {
    id?: number;
    name: string;
    email: string;
    role: string;
}

interface ManageUserProps {
    user: UserData | null;
}

export default function ManageUser({ user }: ManageUserProps) {
    const isUpdateMode = !!user;

    return (
        <div className="py-12">
            <div className="mx-auto sm:px-6 lg:px-8">
                <PageHeader
                    title="Users Show"
                    actionLink="/users"
                    actionText="Kembali"
                    description="Kelola, upload, dan buat wallet users anda disini."
                />

                <div className="flex items-center justify-center bg-background">
                    <Head
                        title={isUpdateMode ? 'Edit User' : 'Tambah User Baru'}
                    />

                    <Card className="w-full shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                {isUpdateMode
                                    ? 'Modifikasi Data User'
                                    : 'Pendaftaran User Baru'}
                            </CardTitle>
                            <CardDescription>
                                {isUpdateMode
                                    ? 'Silakan perbarui data di bawah ini sesuai kebutuhan sistem.'
                                    : 'Isi formulir berikut untuk menambahkan hak akses baru ke sistem.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* user form */}
                            <UserForm user={user} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
