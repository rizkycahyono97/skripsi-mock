import { Badge } from '@/components/ui/badge';
import DocumentActions from './document-action';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
    doc: any;
}

export default function DocumentTableRow({ doc }: Props) {
    const isApproved = doc.status === 'Signed' || doc.status === 'Published';

    return (
        <TableRow>
            <TableCell className="font-medium">{doc.document_number}</TableCell>
            <TableCell>
                <div className="font-medium">{doc.title}</div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                >
                    {doc.document_type}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={
                        isApproved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }
                >
                    {doc.status}
                </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
                {doc.blockchain_transaction ? (
                    <span
                        title={doc.blockchain_transaction.tx_hash}
                        className="cursor-help font-mono text-xs text-green-600 dark:text-green-400"
                    >
                        {doc.blockchain_transaction.tx_hash.substring(0, 10)}...
                    </span>
                ) : (
                    <span>-</span>
                )}
            </TableCell>
            <TableCell className="text-center">
                <DocumentActions doc={doc} />
            </TableCell>
        </TableRow>
    );
}
