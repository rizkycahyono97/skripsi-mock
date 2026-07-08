import PageHeader from '@/components/global/page-header';
import { Card, CardContent } from '@/components/ui/card';
import UserTable from '@/components/users/user-table';
import { index } from '@/routes/users';

type User = {
    id: number | string;
    name: string;
    email: string;
    wallet?: unknown | null;
};

type IndexProps = {
    users: {
        data: User[];
    };
};

export default function Index({ users }: IndexProps) {
    return (
        <div className="py-12">
            <div className="mx-auto sm:px-6 lg:px-8">
                <PageHeader
                    title="Users"
                    description="Kelola, upload, dan buat wallet users anda disini."
                    actionLink="/users/create"
                    actionText="Create User"
                />

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <UserTable users={users.data} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
    ],
};
