import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import type { FormEvent } from 'react';

type Candidate = {
    name: string | null;
    email: string;
};

type Job = {
    id: number;
    title: string;
};

type Application = {
    id: number;
    score: number;
    status: string;
    ai_summary?: string | null;
    candidate: Candidate;
    job: Job;
};

type Props = {
    application: Application;
    jobs: Job[];
};

const statuses = [
    'pending',
    'processing',
    'review',
    'shortlisted',
    'rejected',
    'hired',
];

function formatStatus(status: string) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Edit({ application }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        status: application.status,
        score: application.score,
        ai_summary: application.ai_summary ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(`/applications/${application.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        href={`/applications/${application.id}`}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Application
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Application
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update the application review information.
                    </p>
                </div>

                {/* Candidate Info */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        Candidate
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                        {application.candidate?.name ?? 'Unknown Candidate'}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {application.candidate?.email}
                    </p>

                    <p className="mt-3 text-sm font-medium text-blue-600">
                        {application.job?.title}
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {/* Status */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Application Status
                            </label>

                            <select
                                value={data.status}
                                onChange={(event) =>
                                    setData('status', event.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {formatStatus(status)}
                                    </option>
                                ))}
                            </select>

                            {errors.status && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Score */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10">
                                    <Sparkles size={21} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">
                                        Candidate Score
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Score from 0 to 100.
                                    </p>
                                </div>
                            </div>

                            <input
                                type="number"
                                min={0}
                                max={100}
                                step={0.01}
                                value={data.score}
                                onChange={(event) =>
                                    setData('score', Number(event.target.value))
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />

                            {errors.score && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.score}
                                </p>
                            )}
                        </div>

                        {/* Summary */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                AI / HR Summary
                            </label>

                            <textarea
                                rows={10}
                                value={data.ai_summary}
                                onChange={(event) =>
                                    setData('ai_summary', event.target.value)
                                }
                                placeholder="Candidate summary..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />

                            {errors.ai_summary && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.ai_summary}
                                </p>
                            )}
                        </div>

                        {/* Actions */}

                        <div className="flex justify-end gap-3">
                            <Link
                                href={`/applications/${application.id}`}
                                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save size={18} />

                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
