import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/default/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MetadataItem {
    key: string;
    value: string;
}

interface FormData {
    document_number: string;
    document_type: string;
    title: string;
    issued_date: string;
    metadata: MetadataItem[];
    file: File | null;
}

interface Props {
    data: FormData;
    setData: (key: keyof FormData, value: any) => void;
    errors: Record<string, string>;
}

export default function DocumentUploadForm({ data, setData, errors }: Props) {
    const addMetadata = () => {
        setData('metadata', [...data.metadata, { key: '', value: '' }]);
    };

    const removeMetadata = (indexToRemove: number) => {
        setData(
            'metadata',
            data.metadata.filter((_, index) => index !== indexToRemove),
        );
    };

    const updateMetadata = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        const newMetadata = [...data.metadata];
        newMetadata[index][field] = value;
        setData('metadata', newMetadata);
    };

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="document_number">Nomor Dokumen</Label>
                    <Input
                        id="document_number"
                        className="mt-1 block w-full"
                        value={data.document_number}
                        onChange={(e) =>
                            setData('document_number', e.target.value)
                        }
                        required
                        placeholder="Contoh: DOC/2026/001"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.document_number}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="document_type">Jenis Dokumen</Label>
                    <Select
                        value={data.document_type}
                        onValueChange={(value) =>
                            setData('document_type', value)
                        }
                    >
                        <SelectTrigger
                            id="document_type"
                            className="mt-1 w-full"
                        >
                            <SelectValue placeholder="Pilih Jenis..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ijazah">Ijazah</SelectItem>
                            <SelectItem value="transkrip-nilai">
                                Transkrip Nilai
                            </SelectItem>
                            <SelectItem value="surat-keterangan-lulus">
                                Surat Keterangan Lulus
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError
                        className="mt-2"
                        message={errors.document_type}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="title">Judul Dokumen</Label>
                <Input
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    placeholder="Contoh: Ijazah - Nama Mahasiswa"
                />
                <InputError className="mt-2" message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="issued_date">Tanggal Terbit</Label>
                <Input
                    id="issued_date"
                    type="date"
                    className="mt-1 block w-full sm:w-1/2"
                    value={data.issued_date}
                    onChange={(e) => setData('issued_date', e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.issued_date} />
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Informasi Tambahan (Metadata)</Label>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addMetadata}
                        className="h-8 text-xs hover:bg-ring"
                    >
                        <Plus className="mr-1 h-3 w-3" /> Tambah Baris
                    </Button>
                </div>

                <div className="grid gap-3">
                    {data.metadata.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                className="w-1/3"
                                placeholder="Key (misal: nim)"
                                value={item.key}
                                onChange={(e) =>
                                    updateMetadata(index, 'key', e.target.value)
                                }
                            />
                            <Input
                                className="flex-1"
                                placeholder="Value (misal: 12345678)"
                                value={item.value}
                                onChange={(e) =>
                                    updateMetadata(
                                        index,
                                        'value',
                                        e.target.value,
                                    )
                                }
                            />
                            {data.metadata.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMetadata(index)}
                                    className="p-2 text-muted-foreground transition-colors hover:text-destructive"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <InputError className="mt-2" message={errors.metadata} />
            </div>

            <hr className="border-border" />

            <div className="grid gap-2">
                <Label htmlFor="file">File Dokumen (PDF)</Label>
                <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                    onChange={(e) =>
                        setData('file', e.target.files?.[0] ?? null)
                    }
                    required
                />
                <InputError className="mt-2" message={errors.file} />
            </div>
        </>
    );
}
