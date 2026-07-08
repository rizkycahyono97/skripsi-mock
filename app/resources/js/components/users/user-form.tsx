import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { update, store } from '@/routes/users';
import FormInput from '../global/form-input';

interface UserData {
    id?: number;
    name: string;
    email: string;
    role: string;
}

interface UserFormProps {
    user: UserData | null;
}

export default function UserForm({ user }: UserFormProps) {
    const isUpdateMode = !!user;

    // Inisialisasi useForm dari Inertia
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'public',
        password: '',
        password_confirmation: '',
    });

    console.log('data', data);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdateMode) {
            put(update(user.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('User berhasil diupdate');
                },
                onError: (errors) => {
                    toast.error(
                        Object.values(errors)[0] ?? 'Gagal update user',
                    );
                },
            });
        } else {
            post(store(), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('User berhasil dibuat');
                },
                onError: (errors) => {
                    toast.error(
                        Object.values(errors)[0] ?? 'Gagal membuat user',
                    );
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                label="Nama Lengkap"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
                placeholder="Masukkan nama lengkap"
            />

            <FormInput
                label="Email"
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                placeholder="nama@email.com"
            />

            {/* Reusable Select dengan Shadcn */}
            <div className="grid gap-2">
                <Label
                    htmlFor="role"
                    className={errors.role ? 'text-destructive' : ''}
                >
                    Hak Akses (Role)
                </Label>
                <Select
                    value={data.role}
                    onValueChange={(value) => setData('role', value)}
                >
                    <SelectTrigger
                        className={errors.role ? 'border-destructive' : ''}
                    >
                        <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="arsip">Arsip</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && (
                    <p className="text-xs font-medium text-destructive">
                        {errors.role}
                    </p>
                )}
            </div>

            <FormInput
                label={
                    isUpdateMode
                        ? 'Password Baru (Kosongkan jika tidak diubah)'
                        : 'Password'
                }
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
            />

            <FormInput
                label="Konfirmasi Password"
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                }
                error={errors.password_confirmation}
            />

            <Button type="submit" className="mt-4 w-full" disabled={processing}>
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {isUpdateMode ? 'Perbarui User' : 'Simpan User'}
                    </>
                )}
            </Button>
        </form>
    );
}
