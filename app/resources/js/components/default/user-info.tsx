import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import { Badge } from '../ui/badge';

export function UserInfo({
    user,
    showEmail = false,
    showWallet = false,
}: {
    user: User;
    showEmail?: boolean;
    showWallet?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
                {showWallet && (
                    <div className="mt-2 space-y-1.5">
                        {user.wallet ? (
                            <>
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                >
                                    Wallet: Aktif
                                </Badge>
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Public Address
                                    </label>
                                    <code className="mt-1 block rounded border border-border bg-muted p-2 text-xs break-all text-foreground">
                                        {user.wallet.public_address}
                                    </code>
                                </div>
                            </>
                        ) : (
                            <Badge variant="secondary">Wallet: Belum Ada</Badge>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
