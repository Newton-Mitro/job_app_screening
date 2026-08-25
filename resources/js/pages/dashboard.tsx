import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Medal,
    Search,
    Trophy,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react';

type Candidate = {
    id: number | null;
    name: string | null;
    email: string | null;
    experience_years?: number;
    skills?: string[];
};

type Application = {
    id?: number;
    application_id?: number;
    candidate: Candidate;
    job: {
        id: number | null;
        title: string | null;
    };
    score: number;
    status: string;
    created_at?: string;
};

type Statistics = {
    total_jobs: number;
    open_jobs: number;
    total_candidates: number;
    total_applications: number;
    processing: number;
    pending: number;
    review: number;
    shortlisted: number;
    rejected: number;
    hired: number;
};

type Props = {
    statistics: Statistics;
    recentApplications: Application[];
    topCandidates: Application[];
    applicationsByStatus: {
        pending: number;
        processing: number;
        review: number;
        shortlisted: number;
        rejected: number;
        hired: number;
    };
    applicationsByMonth: {
        month: string;
        total: number;
    }[];
    recentJobs: {
        id: number;
        title: string;
        status: string;
        applications_count: number;
        created_at: string;
    }[];
};

function getStatusStyle(status: string) {
    const styles: Record<string, string> = {
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

        open: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',

        closed: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400',

        draft: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    };

    return (
        styles[status] ??
        'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
    );
}

function formatStatus(status: string) {
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ScoreBadge({ score }: { score: number }) {
    let classes =
        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';

    if (score >= 80) {
        classes =
            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    } else if (score >= 60) {
        classes =
            'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    } else if (score >= 40) {
        classes =
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
    }

    return (
        <span
            className={`inline-flex min-w-[55px] justify-center rounded-lg px-3 py-1 text-sm font-bold ${classes}`}
        >
            {score}%
        </span>
    );
}

export default function Dashboard({
    statistics,
    recentApplications,
    topCandidates,
    applicationsByStatus,
    applicationsByMonth,
    recentJobs,
}: Props) {
    const statusData = [
        {
            label: 'Pending',
            value: applicationsByStatus.pending,
            icon: Clock3,
            color: 'text-yellow-600',
        },
        {
            label: 'Processing',
            value: applicationsByStatus.processing,
            icon: Search,
            color: 'text-blue-600',
        },
        {
            label: 'Review',
            value: applicationsByStatus.review,
            icon: FileText,
            color: 'text-purple-600',
        },
        {
            label: 'Shortlisted',
            value: applicationsByStatus.shortlisted,
            icon: UserCheck,
            color: 'text-green-600',
        },
        {
            label: 'Rejected',
            value: applicationsByStatus.rejected,
            icon: XCircle,
            color: 'text-red-600',
        },
        {
            label: 'Hired',
            value: applicationsByStatus.hired,
            icon: CheckCircle2,
            color: 'text-emerald-600',
        },
    ];

    const maxMonthValue = Math.max(
        ...applicationsByMonth.map((item) => item.total),
        1,
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="rounded-xl bg-blue-600 p-2 text-white">
                                <LayoutDashboard size={22} />
                            </div>

                            <span className="text-sm font-medium text-blue-600">
                                Recruitment Management
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Monitor candidates, applications, and recruitment
                            performance.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/jobs/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <BriefcaseBusiness size={18} />
                            Create Job
                        </Link>

                        <Link
                            href="/candidates"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <Users size={18} />
                            View Candidates
                        </Link>
                    </div>
                </div>

                {/* Main Statistics */}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Jobs
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {statistics.total_jobs}
                                </h2>

                                <p className="mt-2 text-sm text-green-600">
                                    {statistics.open_jobs} open positions
                                </p>
                            </div>

                            <div className="rounded-2xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-500/10">
                                <BriefcaseBusiness size={26} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Candidates
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {statistics.total_candidates}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Candidate profiles
                                </p>
                            </div>

                            <div className="rounded-2xl bg-purple-100 p-4 text-purple-600 dark:bg-purple-500/10">
                                <Users size={26} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Applications
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {statistics.total_applications}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Total job applications
                                </p>
                            </div>

                            <div className="rounded-2xl bg-orange-100 p-4 text-orange-600 dark:bg-orange-500/10">
                                <FileText size={26} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Shortlisted
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {statistics.shortlisted}
                                </h2>

                                <p className="mt-2 text-sm text-green-600">
                                    Ready for interview
                                </p>
                            </div>

                            <div className="rounded-2xl bg-green-100 p-4 text-green-600 dark:bg-green-500/10">
                                <Trophy size={26} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Cards */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {statusData.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex items-center justify-between">
                                    <Icon size={20} className={item.color} />

                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {item.value}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm font-medium text-gray-500">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Content */}

                <div className="mt-8 grid gap-8 xl:grid-cols-3">
                    {/* Recent Applications */}

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Recent Applications
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Latest candidates applying for jobs
                                </p>
                            </div>

                            <Link
                                href="/applications"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Candidate
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Job
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
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentApplications.length > 0 ? (
                                        recentApplications.map(
                                            (application) => (
                                                <tr
                                                    key={application.id}
                                                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {application
                                                                    .candidate
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

                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {application.job
                                                                ?.title ?? '-'}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <ScoreBadge
                                                            score={
                                                                application.score
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                                application.status,
                                                            )}`}
                                                        >
                                                            {formatStatus(
                                                                application.status,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {application.created_at}
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                No applications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Candidates */}

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <Medal size={20} className="text-yellow-500" />

                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Top Candidates
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                Highest ranked candidates
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {topCandidates.length > 0 ? (
                                topCandidates.map((application, index) => (
                                    <div
                                        key={application.application_id}
                                        className="flex items-center gap-4 p-5"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                            {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                                                {application.candidate?.name ??
                                                    'Unknown Candidate'}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                {application.job?.title}
                                            </p>
                                        </div>

                                        <ScoreBadge score={application.score} />
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-sm text-gray-500">
                                    No candidates available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}

                <div className="mt-8 grid gap-8 xl:grid-cols-2">
                    {/* Application Trend */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Application Trend
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Applications received over recent months
                            </p>
                        </div>

                        {applicationsByMonth.length > 0 ? (
                            <div className="flex h-64 items-end gap-4">
                                {applicationsByMonth.map((item) => {
                                    const height =
                                        (item.total / maxMonthValue) * 100;

                                    return (
                                        <div
                                            key={item.month}
                                            className="flex h-full flex-1 flex-col justify-end"
                                        >
                                            <div className="mb-2 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {item.total}
                                            </div>

                                            <div
                                                className="w-full rounded-t-xl bg-blue-600 transition-all hover:bg-blue-700"
                                                style={{
                                                    height: `${height}%`,
                                                    minHeight:
                                                        item.total > 0
                                                            ? '12px'
                                                            : '0px',
                                                }}
                                            />

                                            <p className="mt-3 text-center text-xs text-gray-500">
                                                {item.month}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-64 items-center justify-center text-sm text-gray-500">
                                No application data available.
                            </div>
                        )}
                    </div>

                    {/* Recent Jobs */}

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Recent Jobs
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Latest job openings
                                </p>
                            </div>

                            <Link
                                href="/jobs"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between gap-4 p-5"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10">
                                                <BriefcaseBusiness size={20} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900 dark:text-white">
                                                    {job.title}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {job.applications_count}{' '}
                                                    applications
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                job.status,
                                            )}`}
                                        >
                                            {formatStatus(job.status)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-sm text-gray-500">
                                    No jobs found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <Link
                        href="/jobs/create"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                    >
                        <BriefcaseBusiness
                            size={26}
                            className="text-blue-600"
                        />

                        <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                            Create New Job
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Add a new position and define candidate
                            requirements.
                        </p>
                    </Link>

                    <Link
                        href="/candidates"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                    >
                        <Users size={26} className="text-purple-600" />

                        <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                            Manage Candidates
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Review candidate profiles, skills, and experience.
                        </p>
                    </Link>

                    <Link
                        href="/applications?status=shortlisted"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                    >
                        <GraduationCap size={26} className="text-green-600" />

                        <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                            Review Shortlist
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Review AI-ranked candidates ready for the next
                            recruitment stage.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
