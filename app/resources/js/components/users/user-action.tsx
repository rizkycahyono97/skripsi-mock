import { Link, router } from '@inertiajs/react';
import { MoreVertical, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { show } from '@/routes/users';
import { generate } from '@/routes/wallet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
    id: number | string;
    name: string;
    email: string;
    wallet?: unknown | null;
}

interface Props {
    user: User;
}

export default function UserActions({ user }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleGenerateWallet = () => {
        router.post(
            generate(user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Wallet berhasil dibuat!');
                    setConfirmOpen(false);
                },
                onError: (errors) => {
                    const errorMsg = Object.values(errors);

                    if (errorMsg.length > 0) {
                        toast.error(errorMsg[0]);
                    } else {
                        toast.error('Gagal membuat wallet. silakan coba lagi');
                    }
                },
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={show(user.id)}>Lihat Detail</Link>
                    </DropdownMenuItem>
                    {!user.wallet && (
                        <DropdownMenuItem
                            onClick={() => setConfirmOpen(true)}
                            className="text-primary"
                        >
                            <Wallet className="mr-2 h-4 w-4" />
                            Generate Wallet Baru
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Generate Wallet Baru
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin membuatkan dompet digital
                            untuk{' '}
                            <strong className="text-foreground">
                                {user.name}
                            </strong>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGenerateWallet}>
                            Ya, Generate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
