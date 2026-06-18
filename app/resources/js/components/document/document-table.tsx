import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EmptyState } from '../global/empty-state';
import DocumentTableRow from './document-table-row';

interface Props {
    documents: any[];
}

export default function DocumentTable({ documents }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No. Dokumen</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Blockchain Tx</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.length === 0 ? (
                    <EmptyState
                        title="Dokumen Kosong"
                        description="Dokumen belum dibuat samasekali."
                    />
                ) : (
                    documents.map((doc) => (
                        <DocumentTableRow key={doc.id} doc={doc} />
                    ))
                )}
            </TableBody>
        </Table>
    );
}
