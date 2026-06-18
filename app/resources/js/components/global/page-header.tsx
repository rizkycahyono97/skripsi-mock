import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

interface HeaderProps {
    title: string;
    description: string;
    totalDocuments?: number;
    actionLink?: string;
    actionText?: string;
    onAction?: () => void;
}

export default function PageHeader({
    title,
    description,
    totalDocuments = 0,
    actionLink,
    actionText,
    onAction,
}: HeaderProps) {
    return (
        <div className="relative mb-10 pb-8">
            {/* Main Header Container */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                {/* Text Section */}
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            {title}
                        </h1>
                    </div>
                    <p className="max-w-2xl text-base leading-relaxed text-gray-500 dark:text-slate-400">
                        {description}
                    </p>
                    {totalDocuments ? (
                        <div className="mt-2 flex items-center text-sm font-medium text-muted-foreground">
                            <Users className="mr-1.5 h-4 w-4" />
                            <span>
                                Total: {totalDocuments.toLocaleString('id-ID')}
                            </span>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>

                {/* Action Section */}
                {actionText && (actionLink || onAction) && (
                    <div className="flex shrink-0">
                        {actionLink ? (
                            <Link
                                href={actionLink}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:ring-offset-slate-900"
                            >
                                <ActionIcon />
                                {actionText}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={onAction}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:ring-offset-slate-900"
                            >
                                <ActionIcon />
                                {actionText}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Devider */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gray-200 dark:bg-slate-800">
                <div className="h-[2px] w-100 bg-blue-600 dark:bg-blue-500" />
            </div>
        </div>
    );
}

function ActionIcon() {
    return (
        <svg
            className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
            />
        </svg>
    );
}
