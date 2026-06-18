import { Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    files: any[];
}

export default function DocumentFilesCard({ files }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>File Terlampir</CardTitle>
            </CardHeader>
            <CardContent>
                {files && files.length > 0 ? (
                    <ul className="space-y-3">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className="flex flex-col gap-2 rounded border border-border bg-muted/50 p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">
                                        Ukuran:{' '}
                                        {(file.file_size / 1024).toFixed(2)} KB
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/storage/${file.original_file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <Download className="h-3.5 w-3.5" />{' '}
                                        Download Asli
                                    </a>
                                    {file.verified_file && (
                                        <a
                                            href={`/storage/${file.verified_file}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-sm text-green-600 hover:underline dark:text-green-400"
                                        >
                                            <Download className="h-3.5 w-3.5" />{' '}
                                            Download Tanda Tangan
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada file terlampir.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
