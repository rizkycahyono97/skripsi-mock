import { Link } from '@inertiajs/react';
import { Download, Filter, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { upload } from '@/routes/documents';
import type { DocumentHeaderProps } from '@/types/document';

export default function DocumentHeader({
    totalDocuments = 0,
}: DocumentHeaderProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="mb-6 flex flex-col gap-4">
            {/* BARIS 1: Judul Besar & Tombol Aksi */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                        Documents
                    </h1>
                    <div className="mt-1 flex items-center text-sm font-medium text-muted-foreground">
                        <Users className="mr-1.5 h-4 w-4" />
                        <span>
                            Total: {totalDocuments.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Download className="mr-2 h-4 w-4" /> Export data
                    </Button>
                    <Button asChild className="flex-1 sm:flex-none">
                        <Link href={upload()}>
                            <Plus className="mr-2 h-4 w-4" /> Add document
                        </Link>
                    </Button>
                </div>
            </div>

            {/* BARIS 2: Toolbar Pencarian & Toggle Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search documents, NIM..."
                        className="pl-10"
                    />
                </div>

                <Button
                    variant={showFilters ? 'secondary' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    All filters
                </Button>
            </div>

            {/* BARIS 3: Area Filter Dropdown */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <Card className="bg-muted/50">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                        <div className="w-full sm:w-48">
                            <Label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Tipe Dokumen
                            </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ijazah">
                                        Ijazah
                                    </SelectItem>
                                    <SelectItem value="transkrip">
                                        Transkrip Nilai
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:w-48">
                            <Label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Status Validasi
                            </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="signed">
                                        Signed
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
