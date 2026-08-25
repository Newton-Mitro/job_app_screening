import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Download,
    Edit,
    FileText,
    Mail,
    Phone,
    Sparkles,
    Trash2,
    User,
    XCircle,
} from 'lucide-react';

type Job = {
    id: number;
    title: string;
};

type Application = {
    id: number;
    status: string;
    score: number;
    created_at: string;
    job?: Job;
};

type Candidate = {
    id: number;
    name: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    experience_years?: number;
    education?: string[] | string | null;
    skills?: string[];
    resume_path?: string | null;
    resume_text?: string | null;
    ai_data?: {
        summary?: string;
        strengths?: string[];
        weaknesses?: string[];
    } | null;
    created_at: string;
    applications: Application[];
};

type Statistics = {
    applications: number;
    shortlisted: number;
    hired: number;
    rejected: number;
    average_score: number;
};

type Props = {
    candidate: Candidate;
    statistics: Statistics;
};

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

export default function Show({ candidate, statistics }: Props) {
    const deleteCandidate = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this candidate?',
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/candidates/${candidate.id}`);
    };

    const skills = candidate.skills ?? [];

    const education = Array.isArray(candidate.education)
        ? candidate.education.join(', ')
        : candidate.education;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div className="mb-8">
                    <Link
                        href="/candidates"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Candidates
                    </Link>

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                                {(candidate.name ?? '?')
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {candidate.name ?? 'Unknown Candidate'}
                                </h1>

                                <p className="mt-1 text-gray-500">
                                    Candidate #{candidate.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/candidates/${candidate.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <Edit size={17} />
                                Edit
                            </Link>

                            <button
                                type="button"
                                onClick={deleteCandidate}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                <Trash2 size={17} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">Applications</p>

                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {statistics.applications}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">Average Score</p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {statistics.average_score}%
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">Shortlisted</p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {statistics.shortlisted}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">Hired</p>

                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {statistics.hired}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">Rejected</p>

                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {statistics.rejected}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Candidate Information */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10">
                                <User size={21} />
                            </div>

                            <h2 className="font-bold text-gray-900 dark:text-white">
                                Candidate Information
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="text-xs tracking-wider text-gray-400 uppercase">
                                    Email
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />

                                    <a
                                        href={`mailto:${candidate.email}`}
                                        className="text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        {candidate.email}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs tracking-wider text-gray-400 uppercase">
                                    Phone
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <Phone
                                        size={16}
                                        className="text-gray-400"
                                    />

                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {candidate.phone || 'Not provided'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs tracking-wider text-gray-400 uppercase">
                                    Experience
                                </p>

                                <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {candidate.experience_years ?? 0} years
                                </p>
                            </div>

                            <div>
                                <p className="text-xs tracking-wider text-gray-400 uppercase">
                                    Education
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                                    {education || 'Not provided'}
                                </p>
                            </div>

                            {candidate.address && (
                                <div>
                                    <p className="text-xs tracking-wider text-gray-400 uppercase">
                                        Address
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                                        {candidate.address}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10">
                                <Sparkles size={21} />
                            </div>

                            <h2 className="font-bold text-gray-900 dark:text-white">
                                Skills
                            </h2>
                        </div>

                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No skills available.
                            </p>
                        )}

                        {/* AI Summary */}

                        {candidate.ai_data?.summary && (
                            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                    AI Summary
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                                    {candidate.ai_data.summary}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resume */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-500/10">
                                <FileText size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Resume
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Candidate CV
                                </p>
                            </div>
                        </div>

                        {candidate.resume_path ? (
                            <a
                                href={`/candidates/${candidate.id}/resume`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                            >
                                <Download size={17} />
                                Download Resume
                            </a>
                        ) : (
                            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500 dark:bg-gray-950">
                                No resume uploaded.
                            </div>
                        )}

                        {candidate.resume_text && (
                            <div className="mt-5">
                                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    Extracted Resume Text
                                </p>

                                <div className="max-h-64 overflow-y-auto rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-600 dark:bg-gray-950 dark:text-gray-400">
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {candidate.resume_text}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Strengths */}

                {candidate.ai_data && (
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-500/5">
                            <div className="flex items-center gap-3">
                                <CheckCircle2
                                    size={21}
                                    className="text-green-600"
                                />

                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Strengths
                                </h2>
                            </div>

                            <ul className="mt-5 space-y-3">
                                {candidate.ai_data.strengths?.map(
                                    (strength) => (
                                        <li
                                            key={strength}
                                            className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span className="text-green-600">
                                                ✓
                                            </span>

                                            {strength}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-500/5">
                            <div className="flex items-center gap-3">
                                <XCircle size={21} className="text-red-600" />

                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Areas to Review
                                </h2>
                            </div>

                            <ul className="mt-5 space-y-3">
                                {candidate.ai_data.weaknesses?.map(
                                    (weakness) => (
                                        <li
                                            key={weakness}
                                            className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span className="text-red-600">
                                                •
                                            </span>

                                            {weakness}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Application History */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10">
                                <BriefcaseBusiness size={20} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Application History
                                </h2>

                                <p className="text-sm text-gray-500">
                                    All jobs this candidate has applied for.
                                </p>
                            </div>
                        </div>
                    </div>

                    {candidate.applications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left dark:border-gray-800">
                                        <th className="px-6 py-4 text-xs tracking-wider text-gray-500 uppercase">
                                            Position
                                        </th>

                                        <th className="px-6 py-4 text-xs tracking-wider text-gray-500 uppercase">
                                            Score
                                        </th>

                                        <th className="px-6 py-4 text-xs tracking-wider text-gray-500 uppercase">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-xs tracking-wider text-gray-500 uppercase">
                                            Applied
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs tracking-wider text-gray-500 uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {candidate.applications.map(
                                        (application) => (
                                            <tr
                                                key={application.id}
                                                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                                            >
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {application.job?.title}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="font-bold text-blue-600">
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
                                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <BriefcaseBusiness
                                size={36}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm text-gray-500">
                                This candidate has no applications.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
