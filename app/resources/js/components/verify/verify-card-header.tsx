import { statusConfig } from '@/types/verify';
import type { VerifyStatus } from '@/types/verify';

type Props = {
    status: VerifyStatus;
    message: string;
};

export default function VerifyCardHeader({ status, message }: Props) {
    const config = statusConfig[status] ?? statusConfig.SERVER_ERROR;
    const Icon = config.icon;

    return (
        <div className={`px-6 py-10 text-center ${config.headerClass}`}>
            <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ring-4 ${config.iconWrapClass} ${config.ringClass}`}
            >
                <Icon
                    className={`h-9 w-9 ${config.iconClass}`}
                    strokeWidth={2}
                />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {config.label}
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-white/85">
                {message}
            </p>
            <p className="mt-4 text-xs font-medium tracking-wider text-white/60 uppercase">
                Tasdiqi Blockchain Network
            </p>
        </div>
    );
}
