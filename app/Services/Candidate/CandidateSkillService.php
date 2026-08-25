<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use Illuminate\Support\Facades\DB;

class CandidateSkillService
{
    public function __construct(
        private readonly CandidateNormalizer $normalizer
    ) {
    }

    /**
     * Synchronize candidate skills.
     */
    public function sync(
        Candidate $candidate,
        array $skills,
        string $source = 'resume'
    ): void {
        $candidate->skills()->delete();

        foreach ($skills as $skill) {
            if (!is_string($skill)) {
                continue;
            }

            $skill = trim($skill);

            if ($skill === '') {
                continue;
            }

            $normalized =
                $this->normalizer
                    ->normalizeSkillName(
                        $skill
                    );

            $candidate->skills()->create([
                'name' => $skill,

                'normalized_name' =>
                    $normalized,

                'source' => $source,
            ]);
        }
    }

    /**
     * Add one skill to candidate.
     */
    public function add(
        Candidate $candidate,
        string $skill,
        string $source = 'resume'
    ): void {
        $skill = trim($skill);

        if ($skill === '') {
            return;
        }

        $normalized =
            $this->normalizer
                ->normalizeSkillName(
                    $skill
                );

        $candidate->skills()->firstOrCreate(
            [
                'normalized_name' =>
                    $normalized,
            ],
            [
                'name' => $skill,
                'source' => $source,
            ]
        );
    }

    /**
     * Remove a skill.
     */
    public function remove(
        Candidate $candidate,
        string $skill
    ): void {
        $normalized =
            $this->normalizer
                ->normalizeSkillName(
                    $skill
                );

        $candidate->skills()
            ->where(
                'normalized_name',
                $normalized
            )
            ->delete();
    }

    /**
     * Get normalized skill names.
     */
    public function getNormalizedSkills(
        Candidate $candidate
    ): array {
        return $candidate
            ->skills()
            ->pluck('normalized_name')
            ->values()
            ->toArray();
    }
}