import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, Upload, UserPlus, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

export default function Create() {
    const [resumeName, setResumeName] = useState('');

    const [skillInput, setSkillInput] = useState('');

    const { data, setData, post, processing, errors, progress } = useForm<{
        name: string;
        email: string;
        phone: string;
        address: string;
        experience_years: number | string;
        education: string;
        skills: string[];
        resume: File | null;
        resume_text: string;
    }>({
        name: '',
        email: '',
        phone: '',
        address: '',
        experience_years: '',
        education: '',
        skills: [],
        resume: null,
        resume_text: '',
    });

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) {
            return;
        }

        if (
            data.skills.some(
                (item) => item.toLowerCase() === skill.toLowerCase(),
            )
        ) {
            setSkillInput('');
            return;
        }

        setData('skills', [...data.skills, skill]);
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setData(
            'skills',
            data.skills.filter((item) => item !== skill),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post('/candidates', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl">
                {/* Header */}

                <div className="mb-8">
                    <Link
                        href="/candidates"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Candidates
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-600 p-3 text-white">
                            <UserPlus size={24} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Add Candidate
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Create a candidate profile manually.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {/* Basic Information */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
                                Basic Information
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
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Experience
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={data.experience_years}
                                            onChange={(event) =>
                                                setData(
                                                    'experience_years',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="3"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                        />

                                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
                                            years
                                        </span>
                                    </div>

                                    {errors.experience_years && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.experience_years}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Address
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={data.address}
                                        onChange={(event) =>
                                            setData(
                                                'address',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Candidate address..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.address && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Education & Skills */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
                                Professional Information
                            </h2>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Education
                                </label>

                                <textarea
                                    rows={4}
                                    value={data.education}
                                    onChange={(event) =>
                                        setData('education', event.target.value)
                                    }
                                    placeholder="B.Sc. in Computer Science and Engineering..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                />

                                {errors.education && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.education}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Skills
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        value={skillInput}
                                        onChange={(event) =>
                                            setSkillInput(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        placeholder="Laravel"
                                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {data.skills.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {data.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                            >
                                                {skill}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
                                                    className="hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {errors.skills && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.skills}
                                    </p>
                                )}
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
                                        PDF, DOC or DOCX up to 10 MB.
                                    </p>
                                </div>
                            </div>

                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-12 transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:bg-blue-500/5">
                                <Upload size={34} className="text-gray-400" />

                                <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">
                                    {resumeName || 'Click to upload resume'}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    PDF, DOC, DOCX
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
                                    <div className="mb-2 flex justify-between text-xs text-gray-500">
                                        <span>Uploading</span>

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

                        {/* Resume Text */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Resume Text
                            </label>

                            <p className="mb-4 text-sm text-gray-500">
                                Optional. Paste extracted resume text if
                                available.
                            </p>

                            <textarea
                                rows={10}
                                value={data.resume_text}
                                onChange={(event) =>
                                    setData('resume_text', event.target.value)
                                }
                                placeholder="Paste resume content here..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            />

                            {errors.resume_text && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.resume_text}
                                </p>
                            )}
                        </div>

                        {/* Actions */}

                        <div className="flex justify-end gap-3">
                            <Link
                                href="/candidates"
                                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing || !data.name || !data.email
                                }
                                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Candidate'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
