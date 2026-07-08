import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

/**
 * @param param0
 * @returns
 * component untuk membungkus form, jika ada error dan sebagainya
 */
export default function FormInput({
    label,
    error,
    id,
    ...props
}: FormInputProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
                {label}
            </Label>
            <Input
                id={id}
                className={
                    error
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                }
                {...props}
            />
            {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
            )}
        </div>
    );
}
