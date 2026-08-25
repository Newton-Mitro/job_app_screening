import { Link, router } from '@inertiajs/react';
import {
    Eye,
    Filter,
    Plus,
    RefreshCw,
    Search,
    UserCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';

type Candidate = {
    id: number;
    name: string | null;
    email: string;
    phone?: string | null;
    experience_years?: number;
};

type Job = {
    id: number;
    title: string;
};

type Application = {
    id: number;
    score: number;
    status: string;
    created_at: string;
    candidate: Candidate;
    job: Job;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedApplications = {
    data: Application[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Props = {
    applications: PaginatedApplications;
    jobs: Job[];
    filters: {
        search: string;
        status: string;
        job_circular_id: string | number;
        sort: string;
    };
};

const statuses = [
    'pending',
    'processing',
    'review',
    'shortlisted',
    'rejected',
    'hired',
];

function statusClass(status: string) {
    const classes: Record<string, string> = {
        pending:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
        processing:
            'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        review: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
        shortlisted:
            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
        rejected:
            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    };

    return (
        classes[status] ??
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    );
}

function formatStatus(status: string) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function scoreClass(score: number) {
    if (score >= 80) {
        return 'text-green-600 dark:text-green-400';
    }

    if (score >= 60) {
        return 'text-blue-600 dark:text-blue-400';
    }

    if (score >= 40) {
        return 'text-yellow-600 dark:text-yellow-400';
    }

    return 'text-red-600 dark:text-red-400';
}

export default function Index({ applications, jobs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [jobId, setJobId] = useState(
        filters.job_circular_id ? String(filters.job_circular_id) : '',
    );
    const [sort, setSort] = useState(filters.sort ?? 'latest');

    const applyFilters = () => {
        router.get(
            '/applications',
            {
                search: search || undefined,
                status: status || undefined,
                job_circular_id: jobId || undefined,
                sort,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setJobId('');
        setSort('latest');

        router.get(
            '/applications',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Applications
                        </h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Review and manage job applications.
                        </p>
                    </div>

                    <Link
                        href="/applications/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        New Application
                    </Link>
                </div>

                {/* Filters */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter size={18} className="text-blue-600" />

                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Filter Applications
                        </h2>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-5">
                        <div className="relative lg:col-span-2">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilters();
                                    }
                                }}
                                placeholder="Search candidate or job..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />
                        </div>

                        <select
                            value={jobId}
                            onChange={(event) => setJobId(event.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        >
                            <option value="">All Jobs</option>

                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        >
                            <option value="">All Statuses</option>

                            {statuses.map((item) => (
                                <option key={item} value={item}>
                                    {formatStatus(item)}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        >
                            <option value="latest">Latest First</option>

                            <option value="oldest">Oldest First</option>

                            <option value="score_high">Highest Score</option>

                            <option value="score_low">Lowest Score</option>
                        </select>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Search size={16} />
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Table */}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white">
                                Candidate Applications
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {applications.total} total applications
                            </p>
                        </div>

                        <RefreshCw size={18} className="text-gray-400" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-left dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Candidate
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Position
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Experience
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Score
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Applied
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.data.length > 0 ? (
                                    applications.data.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                                        >
                                            <td className="px-6 py-5">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {application.candidate
                                                            ?.name ??
                                                            'Unknown Candidate'}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {
                                                            application
                                                                .candidate
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-gray-700 dark:text-gray-300">
                                                    {application.job?.title}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-500">
                                                {application.candidate
                                                    ?.experience_years ??
                                                    0}{' '}
                                                years
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`text-lg font-bold ${scoreClass(
                                                        Number(
                                                            application.score,
                                                        ),
                                                    )}`}
                                                >
                                                    {Number(
                                                        application.score,
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(
                                                        application.status,
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        application.status,
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-500">
                                                {application.created_at}
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/applications/${application.id}`}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-16 text-center"
                                        >
                                            <UserCheck
                                                size={42}
                                                className="mx-auto text-gray-300"
                                            />

                                            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                                                No applications found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your filters.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    {applications.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                            <p className="text-sm text-gray-500">
                                Showing {applications.from ?? 0} to{' '}
                                {applications.to ?? 0} of {applications.total}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {applications.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(
                                                    link.url,
                                                    {},
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }
                                        }}
                                        className={`rounded-lg px-3 py-2 text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                  : 'cursor-not-allowed text-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
