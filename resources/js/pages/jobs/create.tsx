import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    GraduationCap,
    Plus,
    Save,
    Sparkles,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type JobForm = {
    title: string;
    description: string;
    required_skills: string[];
    minimum_experience: number | string;
    education_requirement: string;
};

export default function Create() {
    const [skillInput, setSkillInput] = useState('');

    const { data, setData, post, processing, errors } = useForm<JobForm>({
        title: '',
        description: '',
        required_skills: [],
        minimum_experience: 0,
        education_requirement: '',
    });

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) {
            return;
        }

        const exists = data.required_skills.some(
            (item) => item.toLowerCase() === skill.toLowerCase(),
        );

        if (exists) {
            setSkillInput('');
            return;
        }

        setData('required_skills', [...data.required_skills, skill]);

        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setData(
            'required_skills',
            data.required_skills.filter((item) => item !== skill),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post('/jobs');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl">
                {/* Header */}

                <div className="mb-8">
                    <Link
                        href="/jobs"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Jobs
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
                            <BriefcaseBusiness size={25} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create Job
                            </h1>

                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Create a new vacancy and define candidate
                                requirements.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {/* Job Information */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Job Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Basic information about the position.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Title */}

                                <div>
                                    <label
                                        htmlFor="title"
                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Job Title
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        placeholder="e.g. Senior Laravel Developer"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.title && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Job Description
                                    </label>

                                    <textarea
                                        id="description"
                                        rows={9}
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={`Describe the position...

Responsibilities:
- Develop and maintain applications
- Work with the development team
- Review code

Requirements:
- Strong programming skills
- Good communication`}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 leading-7 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Candidate Requirements */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                    <Sparkles size={21} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Candidate Requirements
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        These requirements can later be used for
                                        automatic candidate scoring.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Experience */}

                                <div>
                                    <label
                                        htmlFor="minimum_experience"
                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Minimum Experience
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="minimum_experience"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.minimum_experience}
                                            onChange={(event) =>
                                                setData(
                                                    'minimum_experience',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                        />

                                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
                                            years
                                        </span>
                                    </div>

                                    {errors.minimum_experience && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.minimum_experience}
                                        </p>
                                    )}
                                </div>

                                {/* Education */}

                                <div>
                                    <label
                                        htmlFor="education_requirement"
                                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Education Requirement
                                    </label>

                                    <div className="relative">
                                        <GraduationCap
                                            size={18}
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="education_requirement"
                                            type="text"
                                            value={data.education_requirement}
                                            onChange={(event) =>
                                                setData(
                                                    'education_requirement',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="B.Sc. in Computer Science"
                                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                        />
                                    </div>

                                    {errors.education_requirement && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.education_requirement}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Required Skills
                                </label>

                                <p className="mb-3 text-sm text-gray-500">
                                    Add the technical or professional skills
                                    required for this position.
                                </p>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
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
                                        placeholder="e.g. Laravel"
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
                                    >
                                        <Plus size={18} />
                                        Add
                                    </button>
                                </div>

                                {data.required_skills.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {data.required_skills.map((skill) => (
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
                                                    className="rounded-full hover:text-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {errors.required_skills && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.required_skills}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* AI Candidate Matching Preview */}

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-500/5">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-blue-600 p-3 text-white">
                                    <Sparkles size={20} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        Automatic Candidate Matching
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        Once candidates are received through
                                        email, the recruitment system can use
                                        these requirements to calculate a
                                        candidate match score based on skills,
                                        experience, education and resume
                                        content.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                                            Skills
                                        </span>

                                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                                            Experience
                                        </span>

                                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                                            Education
                                        </span>

                                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                                            Resume
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href="/jobs"
                                className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing || !data.title}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={18} />

                                {processing ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
