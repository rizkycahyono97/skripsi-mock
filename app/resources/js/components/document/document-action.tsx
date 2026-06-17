import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    doc: any;
}

export default function DocumentActions({ doc }: Props) {
    const handleViewDetail = () => {
        console.log('Lihat Detail', doc.id);
    };

    const handleValidate = () => {
        console.log('Validasi (Arsip)', doc.id);
    };

    const handleDelete = () => {
        console.log('Hapus Dokumen', doc.id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewDetail}>
                    Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleValidate}>
                    Validasi (Arsip)
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 dark:text-red-400"
                >
                    Hapus Dokumen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
