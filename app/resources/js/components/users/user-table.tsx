import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import UserActions from './user-action';

interface User {
    id: number | string;
    name: string;
    email: string;
    wallet?: unknown | null;
}

interface Props {
    users: User[];
}

export default function UserTable({ users }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama & Email</TableHead>
                    <TableHead>Status Wallet</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={3}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Tidak ada pengguna ditemukan.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="text-sm font-medium text-foreground">
                                    {user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                            </TableCell>
                            <TableCell>
                                {user.wallet ? (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                    >
                                        Terdaftar
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Belum Ada</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
