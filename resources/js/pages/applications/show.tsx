import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Download,
    FileText,
    RefreshCw,
    Sparkles,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type Candidate = {
    id: number;
    name: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    education?: string[] | Record<string, unknown> | null;
    experience_years?: number;
    skills?: string[];
    resume_path?: string | null;
    resume_text?: string | null;
    ai_data?: {
        summary?: string;
        strengths?: string[];
        weaknesses?: string[];
        [key: string]: unknown;
    } | null;
};

type Job = {
    id: number;
    title: string;
    description?: string | null;
    required_skills?: string[];
    minimum_experience?: number;
    education_requirement?: string | null;
};

type Application = {
    id: number;
    score: number;
    status: string;
    score_breakdown?: {
        skills?: number;
        experience?: number;
        [key: string]: number | undefined;
    } | null;
    ai_summary?: string | null;
    created_at: string;
    candidate: Candidate;
    job: Job;
};

type Props = {
    application: Application;
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

    return classes[status] ?? 'bg-gray-100 text-gray-700';
}

function formatStatus(status: string) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ScoreRing({ score }: { score: number }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-gray-200 dark:text-gray-800"
                />

                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={
                        score >= 80
                            ? 'text-green-500'
                            : score >= 60
                              ? 'text-blue-500'
                              : score >= 40
                                ? 'text-yellow-500'
                                : 'text-red-500'
                    }
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {score.toFixed(0)}%
                </span>

                <span className="text-xs text-gray-500">Match Score</span>
            </div>
        </div>
    );
}

export default function Show({ application }: Props) {
    const [status, setStatus] = useState(application.status);

    const updateStatus = () => {
        router.patch(
            `/applications/${application.id}/status`,
            {
                status,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const reprocess = () => {
        router.post(
            `/applications/${application.id}/reprocess`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const skills = application.candidate?.skills ?? [];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                {/* Header */}

                <div className="mb-8">
                    <Link
                        href="/applications"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Applications
                    </Link>

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-blue-600 p-3 text-white">
                                    <User size={24} />
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {application.candidate?.name ??
                                            'Unknown Candidate'}
                                    </h1>

                                    <p className="mt-1 text-gray-500">
                                        {application.job?.title}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/applications/${application.id}/edit`}
                                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                Edit
                            </Link>

                            <button
                                type="button"
                                onClick={reprocess}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <RefreshCw size={17} />
                                Reprocess AI
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overview */}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex flex-col items-center">
                            <ScoreRing score={Number(application.score)} />

                            <div className="mt-5 text-center">
                                <p className="text-sm text-gray-500">
                                    AI Candidate Score
                                </p>

                                <p className="mt-2 text-sm text-gray-400">
                                    Based on skills and experience
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-5 font-bold text-gray-900 dark:text-white">
                            Application Status
                        </h2>

                        <div className="flex items-center gap-3">
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            >
                                {statuses.map((item) => (
                                    <option key={item} value={item}>
                                        {formatStatus(item)}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={updateStatus}
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Update
                            </button>
                        </div>

                        <div className="mt-6">
                            <span
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass(
                                    application.status,
                                )}`}
                            >
                                {formatStatus(application.status)}
                            </span>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                            <p className="text-xs tracking-wider text-gray-400 uppercase">
                                Applied
                            </p>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {application.created_at}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-5 font-bold text-gray-900 dark:text-white">
                            Candidate Contact
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-400">Email</p>

                                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">
                                    {application.candidate?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400">Phone</p>

                                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">
                                    {application.candidate?.phone ||
                                        'Not provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400">Experience</p>

                                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">
                                    {application.candidate?.experience_years ??
                                        0}{' '}
                                    years
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Summary */}

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-6 dark:border-blue-900/40 dark:bg-blue-500/5">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-blue-600 p-3 text-white">
                            <Sparkles size={22} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-bold text-gray-900 dark:text-white">
                                AI Candidate Analysis
                            </h2>

                            <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                                {application.ai_summary ||
                                    application.candidate?.ai_data?.summary ||
                                    'AI analysis is not available yet. Click Reprocess AI to analyze this candidate.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Skills */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="font-bold text-gray-900 dark:text-white">
                            Candidate Skills
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                                skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No skills extracted yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Score Breakdown */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="font-bold text-gray-900 dark:text-white">
                            Score Breakdown
                        </h2>

                        <div className="mt-5 space-y-5">
                            {Object.entries(
                                application.score_breakdown ?? {},
                            ).map(([key, value]) => (
                                <div key={key}>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="font-medium text-gray-600 capitalize dark:text-gray-300">
                                            {key.replaceAll('_', ' ')}
                                        </span>

                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {Number(value).toFixed(1)}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{
                                                width: `${Math.min(
                                                    Number(value) * 2,
                                                    100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Job Requirements */}

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                        Job Requirements
                    </h2>

                    <div className="mt-5 grid gap-6 md:grid-cols-3">
                        <div>
                            <p className="text-xs tracking-wider text-gray-400 uppercase">
                                Position
                            </p>

                            <p className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
                                {application.job?.title}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs tracking-wider text-gray-400 uppercase">
                                Experience Required
                            </p>

                            <p className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
                                {application.job?.minimum_experience} years
                            </p>
                        </div>

                        <div>
                            <p className="text-xs tracking-wider text-gray-400 uppercase">
                                Education
                            </p>

                            <p className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
                                {application.job?.education_requirement ||
                                    'Not specified'}
                            </p>
                        </div>
                    </div>

                    {application.job?.required_skills &&
                        application.job.required_skills.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Required Skills
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {application.job.required_skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300"
                                            >
                                                {skill}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                </div>

                {/* Resume */}

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-500/10">
                                <FileText size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Candidate Resume
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Original resume document
                                </p>
                            </div>
                        </div>

                        {application.candidate?.resume_path && (
                            <a
                                href={`/storage/${application.candidate.resume_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                            >
                                <Download size={16} />
                                Open Resume
                            </a>
                        )}
                    </div>

                    {application.candidate?.resume_text && (
                        <div className="mt-6 max-h-96 overflow-y-auto rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                            <pre className="font-sans whitespace-pre-wrap">
                                {application.candidate.resume_text}
                            </pre>
                        </div>
                    )}
                </div>

                {/* AI Strengths */}

                {application.candidate?.ai_data && (
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-500/5">
                            <div className="flex items-center gap-3">
                                <CheckCircle2
                                    size={22}
                                    className="text-green-600"
                                />

                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Strengths
                                </h2>
                            </div>

                            <ul className="mt-5 space-y-3">
                                {application.candidate.ai_data.strengths?.map(
                                    (item) => (
                                        <li
                                            key={item}
                                            className="flex gap-2 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span className="text-green-600">
                                                •
                                            </span>

                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-500/5">
                            <div className="flex items-center gap-3">
                                <XCircle size={22} className="text-red-600" />

                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    Areas to Review
                                </h2>
                            </div>

                            <ul className="mt-5 space-y-3">
                                {application.candidate.ai_data.weaknesses?.map(
                                    (item) => (
                                        <li
                                            key={item}
                                            className="flex gap-2 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span className="text-red-600">
                                                •
                                            </span>

                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
