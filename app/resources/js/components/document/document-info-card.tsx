import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    document: any;
}

export default function DocumentInfoCard({ document }: Props) {
    const isVerified = document.status === 'verified';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Nomor Dokumen
                    </p>
                    <p className="font-medium text-foreground">
                        {document.document_number}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">
                        Tipe Dokumen
                    </p>
                    <p className="font-medium text-foreground">
                        {document.document_type}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">
                        Tanggal Terbit
                    </p>
                    <p className="font-medium text-foreground">
                        {new Date(document.issued_date).toLocaleDateString(
                            'id-ID',
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                        variant="secondary"
                        className={
                            isVerified
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        }
                    >
                        {document.status.toUpperCase()}
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                    <p className="font-medium text-foreground">
                        {document.creator?.name || 'Unknown'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
