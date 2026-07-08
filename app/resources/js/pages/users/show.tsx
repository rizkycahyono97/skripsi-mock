import { UserInfo } from '@/components/default/user-info';
import PageHeader from '@/components/global/page-header';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserForm from '@/components/users/user-form';
import UserProfileHeader from '@/components/users/user-profile-header';
import WalletCard from '@/components/wallet/wallet-card';
import { index } from '@/routes/users';
import type { User } from '@/types';

export default function Show({ user }: { user: User }) {
    return (
        <div className="py-12">
            <div className="mx-auto space-y-6 sm:px-6 lg:px-8">
                <PageHeader
                    title={user ? 'Edit Data User' : 'Tambah User Baru'}
                    actionLink="/users"
                    actionText="Kembali"
                    description="Kelola, upload, dan buat wallet users anda disini."
                />

                <Card className="overflow-hidden shadow-sm">
                    <UserProfileHeader />
                    <Separator />

                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-4 lg:col-span-2">
                                <div className="mb-2">
                                    <h3 className="text-lg font-medium text-foreground">
                                        Formulir Informasi
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Silakan lengkapi data kredensial user di
                                        bawah ini.
                                    </p>
                                </div>
                                <Separator className="my-2 opacity-50" />
                                <UserForm user={user} />
                            </div>

                            {user && (
                                <div className="h-fit space-y-4 rounded-xl border border-border bg-muted/40 p-6">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            Ringkasan Profil
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Data akun dan wallet kripto yang
                                            terdaftar.
                                        </p>
                                    </div>
                                    <Separator />

                                    <WalletCard user={user} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Show.layout = {
    breadcrumbs: [{ title: 'Users', href: index() }, { title: 'Detail' }],
};
