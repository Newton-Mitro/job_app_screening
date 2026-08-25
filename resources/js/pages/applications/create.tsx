import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Upload, UserPlus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type Job = {
    id: number;
    title: string;
};

type Props = {
    jobs: Job[];
};

export default function Create({ jobs }: Props) {
    const [resumeName, setResumeName] = useState('');

    const { data, setData, post, processing, errors, progress } = useForm<{
        job_circular_id: string;
        name: string;
        email: string;
        phone: string;
        resume: File | null;
        resume_text: string;
    }>({
        job_circular_id: '',
        name: '',
        email: '',
        phone: '',
        resume: null,
        resume_text: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post('/applications', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl">
                {/* Header */}

                <div className="mb-8">
                    <Link
                        href="/applications"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Applications
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-600 p-3 text-white">
                            <UserPlus size={24} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                New Application
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Add a candidate and start the screening process.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {/* Job */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
                                Job Information
                            </h2>

                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Position
                            </label>

                            <select
                                value={data.job_circular_id}
                                onChange={(event) =>
                                    setData(
                                        'job_circular_id',
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            >
                                <option value="">Select a job</option>

                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>

                            {errors.job_circular_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.job_circular_id}
                                </p>
                            )}
                        </div>

                        {/* Candidate */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
                                Candidate Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>

                                    <input
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="John Smith"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData('email', event.target.value)
                                        }
                                        placeholder="john@example.com"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Phone
                                    </label>

                                    <input
                                        value={data.phone}
                                        onChange={(event) =>
                                            setData('phone', event.target.value)
                                        }
                                        placeholder="+880..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resume */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10">
                                    <FileText size={22} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">
                                        Resume / CV
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Upload PDF, DOC, or DOCX.
                                    </p>
                                </div>
                            </div>

                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-12 transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:bg-blue-500/5">
                                <Upload size={34} className="text-gray-400" />

                                <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                                    {resumeName || 'Click to upload resume'}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    PDF, DOC, DOCX — max 10 MB
                                </p>

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file =
                                            event.target.files?.[0] ?? null;

                                        setData('resume', file);

                                        setResumeName(file?.name ?? '');
                                    }}
                                />
                            </label>

                            {errors.resume && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.resume}
                                </p>
                            )}

                            {progress && (
                                <div className="mt-4">
                                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                                        <span>Uploading...</span>

                                        <span>{progress.percentage}%</span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                        <div
                                            className="h-full bg-blue-600 transition-all"
                                            style={{
                                                width: `${progress.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Optional Resume Text */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                Resume Text
                            </h2>

                            <p className="mb-4 text-sm text-gray-500">
                                Optional. Useful when resume text has already
                                been extracted.
                            </p>

                            <textarea
                                value={data.resume_text}
                                onChange={(event) =>
                                    setData('resume_text', event.target.value)
                                }
                                rows={10}
                                placeholder="Paste resume text here..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />
                        </div>

                        {/* Actions */}

                        <div className="flex justify-end gap-3">
                            <Link
                                href="/applications"
                                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.job_circular_id ||
                                    !data.name ||
                                    !data.email
                                }
                                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Application'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
