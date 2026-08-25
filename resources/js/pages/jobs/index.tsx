import { Link, router } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    CalendarDays,
    ChevronRight,
    Clock3,
    Plus,
    Search,
    Users,
} from 'lucide-react';
import { useState } from 'react';

type Job = {
    id: number;
    title: string;
    description?: string | null;
    required_skills?: string[] | null;
    minimum_experience: number;
    education_requirement?: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type JobsPagination = {
    data: Job[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type Props = {
    jobs: JobsPagination;
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function Index({ jobs }: Props) {
    const [search, setSearch] = useState('');

    const filteredJobs = jobs.data.filter((job) => {
        const query = search.toLowerCase();

        return (
            job.title.toLowerCase().includes(query) ||
            job.description?.toLowerCase().includes(query) ||
            job.education_requirement?.toLowerCase().includes(query) ||
            job.required_skills?.some((skill) =>
                skill.toLowerCase().includes(query),
            )
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                            <BriefcaseBusiness size={16} />
                            Recruitment
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Jobs
                        </h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Manage your job vacancies and recruitment
                            requirements.
                        </p>
                    </div>

                    <Link
                        href="/jobs/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create Job
                    </Link>
                </div>

                {/* Search */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search jobs, skills, education..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                    </div>
                </div>

                {/* Summary */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Jobs
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {jobs.total}
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <BriefcaseBusiness size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Current Page
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {jobs.current_page}
                                </p>
                            </div>

                            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                <CalendarDays size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Showing</p>

                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {filteredJobs.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                <Users size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Cards */}

                {filteredJobs.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                            >
                                {/* Card Header */}

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                        <BriefcaseBusiness size={22} />
                                    </div>

                                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        #{job.id}
                                    </span>
                                </div>

                                {/* Title */}

                                <h2 className="mt-5 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                                    {job.title}
                                </h2>

                                {/* Description */}

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    {job.description ||
                                        'No job description provided.'}
                                </p>

                                {/* Requirements */}

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                            <Clock3
                                                size={16}
                                                className="text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Experience
                                            </p>

                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                {job.minimum_experience} years
                                                minimum
                                            </p>
                                        </div>
                                    </div>

                                    {job.education_requirement && (
                                        <div className="flex items-start gap-3 text-sm">
                                            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                                <Users
                                                    size={16}
                                                    className="text-gray-500"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Education
                                                </p>

                                                <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                    {job.education_requirement}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Skills */}

                                {job.required_skills &&
                                    job.required_skills.length > 0 && (
                                        <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
                                            <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                Required Skills
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {job.required_skills
                                                    .slice(0, 6)
                                                    .map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                {/* Footer */}

                                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Created
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {formatDate(job.created_at)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.get(`/jobs/${job.id}`)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-600 dark:hover:text-white"
                                    >
                                        View
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-gray-800 dark:bg-gray-900">
                        <BriefcaseBusiness
                            size={48}
                            className="mx-auto text-gray-300 dark:text-gray-700"
                        />

                        <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                            No jobs found
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {search
                                ? 'Try changing your search criteria.'
                                : 'Create your first job vacancy to get started.'}
                        </p>

                        {!search && (
                            <Link
                                href="/jobs/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus size={17} />
                                Create Job
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}

                {jobs.last_page > 1 && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">
                            Showing {jobs.from ?? 0} to {jobs.to ?? 0} of{' '}
                            {jobs.total} jobs
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {jobs.links.map((link, index) => (
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
    );
}
