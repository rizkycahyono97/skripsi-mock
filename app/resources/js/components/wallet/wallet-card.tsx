import { router } from '@inertiajs/react';
import { Wallet, Copy, Check, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner'; // Atau dari library toast Anda (misal: react-hot-toast)
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generate } from '@/routes/wallet';

interface WalletData {
    public_address: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    wallet?: WalletData | null;
}

interface UserWalletCardProps {
    user: UserData;
}

export default function UserWalletCard({ user }: UserWalletCardProps) {
    const [copied, setCopied] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleCopy = async () => {
        if (user.wallet?.public_address) {
            await navigator.clipboard.writeText(user.wallet.public_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleGenerateWallet = () => {
        setGenerating(true);
        router.post(
            generate(user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Wallet berhasil dibuat!');
                    setConfirmOpen(false);
                    setGenerating(false);
                },
                onError: (errors) => {
                    setGenerating(false);
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
        <div className="space-y-4">
            {/* Status Informasi Dasar */}
            <div className="space-y-1">
                <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                </p>
            </div>

            {/* Area Informasi Wallet */}
            <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span>Status Jaringan</span>
                    </div>
                    {user.wallet ? (
                        <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400">
                            Aktif
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Belum Ada</Badge>
                    )}
                </div>

                {user.wallet ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                Public Address
                            </label>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={handleCopy}
                                title="Salin Alamat"
                            >
                                {copied ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                        <code className="block rounded border border-border/60 bg-muted p-2 font-mono text-xs leading-normal break-all text-foreground select-all">
                            {user.wallet.public_address}
                        </code>
                    </div>
                ) : (
                    <div className="space-y-3 pt-1">
                        <p className="mb-5 text-center text-xs text-muted-foreground">
                            User ini belum mengonfigurasi wallet kripto di
                            sistem.
                        </p>

                        <AlertDialog
                            open={confirmOpen}
                            onOpenChange={setConfirmOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-1.5"
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Plus className="h-3.5 w-3.5" />
                                    )}
                                    Generate Wallet Crypto
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Generate Wallet Baru?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini akan membuat sepasang Kunci
                                        Kriptografi baru (Public & Private Key)
                                        untuk <strong>{user.name}</strong> di
                                        blockchain. Pastikan server terhubung
                                        dengan node jaringan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleGenerateWallet();
                                        }}
                                    >
                                        Ya, Generate
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
