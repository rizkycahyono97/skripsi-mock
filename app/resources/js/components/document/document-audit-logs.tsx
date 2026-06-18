import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    auditLogs: any[];
}

export default function DocumentAuditLogCard({ auditLogs }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Aktivitas</CardTitle>
            </CardHeader>
            <CardContent>
                {auditLogs && auditLogs.length > 0 ? (
                    <div className="max-h-64 space-y-4 overflow-y-auto pr-2">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="text-sm">
                                <p className="font-semibold text-foreground">
                                    {log.action}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Oleh: {log.user?.name || 'Sistem'} •{' '}
                                    {new Date(log.created_at).toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Belum ada riwayat aktivitas.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
