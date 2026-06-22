import { UserInfo } from '@/components/default/user-info';
import PageHeader from '@/components/global/page-header';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserProfileHeader from '@/components/users/user-profile-header';
import { index } from '@/routes/users';
import type { User } from '@/types';

export default function Show({ user }: { user: User }) {
    return (
        <div className="py-12">
            <div className="mx-auto sm:px-6 lg:px-8">
                <PageHeader
                    title="Users"
                    actionLink="/users"
                    actionText="Kembali"
                    description="Kelola, upload, dan buat wallet users anda disini."
                />

                <Card>
                    <UserProfileHeader />
                    <Separator />
                    <CardContent>
                        <div className="flex items-start gap-4">
                            <UserInfo user={user} showEmail showWallet />
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
