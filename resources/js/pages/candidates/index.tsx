import { Link, router } from '@inertiajs/react';
import { Eye, Filter, Mail, Phone, Plus, Search, Users, X } from 'lucide-react';
import { useState } from 'react';

type Job = {
    id: number;
    title: string;
};

type Application = {
    id: number;
    job?: Job;
    status: string;
    score: number;
    created_at: string;
};

type Candidate = {
    id: number;
    name: string | null;
    email: string;
    phone?: string | null;
    experience_years?: number;
    applications_count: number;
    applications?: Application[];
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type CandidatesPagination = {
    data: Candidate[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Props = {
    candidates: CandidatesPagination;

    filters: {
        search: string;
        sort: string;
    };
};

function getAverageScore(candidate: Candidate) {
    if (!candidate.applications?.length) {
        return 0;
    }

    const total = candidate.applications.reduce(
        (sum, application) => sum + Number(application.score || 0),
        0,
    );

    return total / candidate.applications.length;
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

export default function Index({ candidates, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const [sort, setSort] = useState(filters.sort ?? 'latest');

    const applyFilters = () => {
        router.get(
            '/candidates',
            {
                search: search || undefined,
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
        setSort('latest');

        router.get(
            '/candidates',
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

                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Candidates
                        </h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Manage and review candidates in your recruitment
                            pipeline.
                        </p>
                    </div>

                    <Link
                        href="/candidates/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Candidate
                    </Link>
                </div>

                {/* Filter */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter size={18} className="text-blue-600" />

                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Search Candidates
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
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
                                placeholder="Search by name, email or phone..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />
                        </div>

                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        >
                            <option value="latest">Latest Candidates</option>

                            <option value="oldest">Oldest Candidates</option>

                            <option value="name">Name A-Z</option>

                            <option value="score_high">Highest Score</option>

                            <option value="score_low">Lowest Score</option>
                        </select>

                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Search size={16} />
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Candidates */}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white">
                                All Candidates
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {candidates.total} candidates
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10">
                            <Users size={20} />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-left dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Candidate
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Contact
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Experience
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Applications
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Avg. Score
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {candidates.data.length > 0 ? (
                                    candidates.data.map((candidate) => {
                                        const score =
                                            getAverageScore(candidate);

                                        return (
                                            <tr
                                                key={candidate.id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                            {(
                                                                candidate.name ??
                                                                '?'
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {candidate.name ??
                                                                    'Unknown Candidate'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                ID #
                                                                {candidate.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                            <Mail size={14} />

                                                            {candidate.email}
                                                        </div>

                                                        {candidate.phone && (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <Phone
                                                                    size={14}
                                                                />

                                                                {
                                                                    candidate.phone
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                                                    {candidate.experience_years ??
                                                        0}{' '}
                                                    years
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                        {
                                                            candidate.applications_count
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`font-bold ${scoreClass(
                                                            score,
                                                        )}`}
                                                    >
                                                        {score.toFixed(0)}%
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/candidates/${candidate.id}`}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-16 text-center"
                                        >
                                            <Users
                                                size={42}
                                                className="mx-auto text-gray-300"
                                            />

                                            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                                                No candidates found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try a different search.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    {candidates.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                            <p className="text-sm text-gray-500">
                                Showing {candidates.from ?? 0} to{' '}
                                {candidates.to ?? 0} of {candidates.total}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {candidates.links.map((link, index) => (
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
