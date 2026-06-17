import { Link } from '@inertiajs/react';

export default function Pagination({ links }: { links: any[] }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-6 flex justify-center">
            {links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="mx-1 cursor-not-allowed rounded border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-400 opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`mx-1 rounded border px-3 py-1 text-sm transition-colors ${
                            link.active
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-400'
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveState
                    ></Link>
                );
            })}
        </div>
    );
}
