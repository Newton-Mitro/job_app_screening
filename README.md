Your core workflow could look like this:

```
Job Circular
     │
     ▼
Create Job
(job_id, title, requirements)
     │
     ▼
Candidate sends email
Subject: JOB-001 | Software Engineer
     │
     ▼
Email Inbox Listener
     │
     ▼
Validate Job ID + Job Title
     │
     ├── Invalid → Mark as rejected/manual review
     │
     ▼
Extract Candidate Information
     │
     ├── Name
     ├── Email
     ├── Phone
     ├── Resume
     ├── Cover Letter
     └── Attachments
     │
     ▼
Resume Parser
     │
     ├── Skills
     ├── Experience
     ├── Education
     ├── Previous Companies
     └── Technologies
     │
     ▼
Screening Engine
     │
     ├── Required Skills Score
     ├── Experience Score
     ├── Education Score
     ├── Notice Period
     ├── Salary Match
     └── AI/Keyword Matching
     │
     ▼
Final Score
     │
     ▼
Ranking + Shortlisting
```

## 1. Job Module

HR/Admin creates a job circular.

```json
{
    "job_id": "JOB-001",
    "job_title": "Software Engineer",
    "department": "IT",
    "employment_type": "Full Time",
    "minimum_experience": 2,
    "required_skills": ["PHP", "Laravel", "JavaScript", "SQL", "REST API"],
    "preferred_skills": ["React", "TypeScript", "Flutter"],
    "minimum_education": "Bachelor",
    "questions": [
        {
            "question": "What is your current salary?",
            "required": true
        },
        {
            "question": "What is your expected salary?",
            "required": true
        },
        {
            "question": "What is your notice period?",
            "required": true
        }
    ]
}
```

## 2. Candidate Email Format

Ask candidates to follow a standard subject:

```
Application | JOB-001 | Software Engineer
```

Or:

```
JOB-001 | Software Engineer
```

Example:

```
To: career@organization.com

Subject: Application | JOB-001 | Software Engineer

Dear Hiring Team,

I would like to apply for the Software Engineer position.

Current Salary: 50,000 BDT
Expected Salary: 70,000 BDT
Notice Period: 30 Days

Regards,
John Doe

Attachment:
john-doe-resume.pdf

```

Your system reads:

```
Subject
  ↓
JOB-001
  ↓
Find Job in Database
  ↓
Software Engineer
  ↓
Verify Job
```

## 3. Main Database Design

I recommend these main tables:

```
jobs
candidates
candidate_applications
candidate_skills
resumes
email_messages
screening_results
screening_questions
candidate_answers
attachments
```

### Jobs

```
jobs
├── id
├── job_id
├── job_title
├── description
├── minimum_experience
├── minimum_education
├── status
├── created_at
└── updated_at
```

### Candidates

```
candidates
├── id
├── name
├── email
├── phone
├── linkedin_url
├── github_url
├── total_experience
├── current_salary
├── expected_salary
├── notice_period
├── created_at
└── updated_at
```

A candidate can apply for multiple jobs, so don't store everything directly in one candidate record.

### Candidate Applications

```
candidate_applications
├── id
├── job_id
├── candidate_id
├── application_number
├── status
├── total_score
├── recommendation
├── applied_at
├── screened_at
└── created_at
```

Example:

```
Candidate: John Doe
Applied Job: JOB-001
Score: 82
Status: Shortlisted
```

### Skills

```
skills
├── id
├── name
└── normalized_name
```

Example:

```
Laravel
React
TypeScript
MySQL
Docker
Flutter
```

### Candidate Skills

```
candidate_skills
├── id
├── candidate_id
├── skill_id
├── years_of_experience
└── confidence
```

### Job Skills

```
job_skills
├── id
├── job_id
├── skill_id
├── importance
└── required
```

## 4. Email Processing Module

Since you are already working with Node.js, your architecture could be:

```
Laravel / React
        │
        ├── Email Worker
        │       └── IMAP
        │
        ├── Resume Parser
        │
        ├── Screening Engine
        │
        └── REST API
                │
                ▼
              MySQL
                │
                ▼
        React Admin Dashboard
```

A worker continuously checks your inbox:

Flow:

```
IMAP Inbox
   │
   ▼
Find Unprocessed Emails
   │
   ▼
Parse Subject
   │
   ▼
Find Job
   │
   ├── Job not found → Invalid application
   │
   ▼
Save Email
   │
   ▼
Save Attachments
   │
   ▼
Find Resume
   │
   ▼
Extract Resume Text
   │
   ▼
Extract Candidate Information
   │
   ▼
Run Screening
```

## 5. Email Subject Validation

You should support flexible patterns.

For example:

```
JOB-001 | Software Engineer
Application for JOB-001 - Software Engineer
ID: JOB-001, Post: Software Engineer
```

Create a parser:

```
function parseJobFromSubject(subject: string) {
  const jobIdMatch = subject.match(/JOB-\d+/i);

  return {
    jobId: jobIdMatch?.[0]?.toUpperCase() ?? null,
    subject,
  };
}
```

Then:

```
const job = await jobRepository.findByJobId(jobId);

if (!job) {
  await applicationService.markInvalidEmail(email);
}
```

You can later make the parser smarter using regex + AI.

## 6. Resume Processing

This is the most important part.

When a PDF or DOCX resume arrives:

```
resume.pdf
    │
    ▼
Text Extraction
    │
    ▼
Raw Resume Text
    │
    ▼
Information Extraction
    │
    ├── Name
    ├── Email
    ├── Phone
    ├── Skills
    ├── Education
    ├── Experience
    └── Companies
```

For example, the resume contains:

```
Skills:
PHP, Laravel, React, TypeScript, MySQL, Docker

Experience:
Software Engineer
ABC Software Ltd.
3 Years
```

Your normalized result:

```json
{
    "name": "John Doe",
    "skills": [
        {
            "name": "Laravel",
            "confidence": 0.98
        },
        {
            "name": "React",
            "confidence": 0.95
        }
    ],
    "total_experience": 3,
    "education": [
        {
            "degree": "BSc",
            "subject": "Computer Science"
        }
    ]
}
```

## 7. Screening Engine

I strongly recommend starting with a rule-based scoring system, not AI-only.

For example:

### Required Skills — 40 points

```
Laravel      → 10
PHP          → 10
JavaScript   → 8
SQL          → 6
REST API     → 6
```

### Experience — 25 points

```
2 years minimum

0 years → 0
1 year → 10
2 years → 20
3+ years → 25
```

### Education — 15 points

```
Relevant Bachelor → 15
Other Bachelor → 10
Diploma → 5
```

### Preferred Skills — 10 points

```
React → +3
TypeScript → +3
Flutter → +4
```

### Email/Application Quality — 10 points

```
Correct Job ID → 5
Correct Job Title → 3
Resume Attached → 2
```

Final:

```
Skills Score 35/40
Experience Score 25/25
Education Score 15/15
Preferred Skills 7/10
Application Score 10/10

Total Score: 92/100
```

## 8. Candidate Ranking

Your dashboard can show:

```
| Rank | Candidate   | Job               | Score | Status      |
| ---- | ----------- | ----------------- | ----: | ----------- |
| 1    | John Doe    | Software Engineer |    92 | Shortlisted |
| 2    | Jane Smith  | Software Engineer |    87 | Shortlisted |
| 3    | Alex Brown  | Software Engineer |    74 | Review      |
| 4    | Candidate X | Software Engineer |    45 | Rejected    |

```

Recommended rules:

```
85–100 → Highly Recommended
70–84  → Recommended
50–69  → Manual Review
0–49   → Not Recommended
```

## 9. AI Layer

After your deterministic scoring works, add AI as an additional analysis layer.

The AI should return structured JSON:

```json
{
    "summary": "Candidate has strong backend development experience.",
    "matched_skills": ["PHP", "Laravel", "MySQL"],
    "missing_skills": ["Docker", "TypeScript"],
    "experience_match": "strong",
    "recommendation": "shortlist",
    "confidence": 0.87
}
```

Important: don't let AI completely decide who gets rejected.

A safer architecture is:

```
Rule-Based Engine
        +
AI Resume Analysis
        +
Human Review
        =
Final Decision
```

This gives you a much more auditable and maintainable system.

## 10. Recommended Project Structure

Since you are already working with TypeScript, I would build it like this:

```
candidate-screening/
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── modules/
│   │   ├── jobs/
│   │   ├── candidates/
│   │   ├── applications/
│   │   ├── emails/
│   │   ├── resumes/
│   │   ├── screening/
│   │   └── skills/
│   │
│   ├── workers/
│   │   ├── email.worker.ts
│   │   ├── resume.worker.ts
│   │   └── screening.worker.ts
│   │
│   ├── services/
│   │   ├── storage.service.ts
│   │   └── ai.service.ts
│   │
│   └── app.ts
│
├── prisma/
│   └── schema.prisma
│
└── uploads/
    └── resumes/
```

## My recommended tech stack

### Backend

- Node.js
- TypeScript
- Express or NestJS
- PostgreSQL
- Prisma
- IMAPFlow
- Mailparser

### Queue

- Redis
- BullMQ

### Resume Processing

- PDF text extraction
- DOCX text extraction
- OCR for scanned PDFs later

### Storage

- Local storage for development
- S3-compatible object storage for production

### Frontend

- React
- TypeScript
- Tailwind CSS

## Best MVP roadmap

### Phase 1 — Core

1. Create Job
2. Create Job ID
3. Connect email inbox
4. Read unread emails
5. Parse email subject
6. Match Job ID
7. Save candidate
8. Save attachments

### Phase 2 — Resume Processing

1. Detect PDF/DOCX
2. Extract text
3. Extract email/phone
4. Extract skills
5. Extract experience
6. Extract education

### Phase 3 — Screening

1. Configure required skills
2. Configure scoring rules
3. Calculate score
4. Rank candidates
5. Shortlist candidates

### Phase 4 — Dashboard

```
Dashboard
├── Jobs
├── Inbox
├── Candidates
├── Applications
├── Screening Results
├── Shortlisted Candidates
└── Reports
```

### Phase 5 — AI

1. Resume summarization
2. Skill normalization
3. Experience analysis
4. Candidate-job matching
5. Interview question generation

### The architecture I would choose for you

Because you already started a TypeScript candidate-screening project with email reading, I would continue with:

```
React Admin Dashboard
        │
        ▼
Node.js + TypeScript API
        │
        ├── Job Module
        ├── Candidate Module
        ├── Email Module
        ├── Resume Module
        └── Screening Module
        │
        ▼
      BullMQ
        │
        ├── Email Processing Worker
        ├── Resume Processing Worker
        └── Screening Worker
        │
        ▼
     PostgreSQL + Prisma
        │
        ▼
 Object Storage for Resumes
```

The next best step is to design the database schema properly first. After that, we can build the modules in order:

```
Job → Email → Candidate → Resume → Skills → Screening → Dashboard
```

That will keep the system scalable instead of turning it into one giant email-processing script.

## 1. Business Workflow

```
┌─────────────────────┐
│ HR Creates Job      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│ Generate Job Circular       │
│ JOB-001                     │
│ Software Engineer           │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Candidate Sends Application Email │
│                                  │
│ Subject:                         │
│ JOB-001 | Software Engineer      │
└──────────┬───────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Organization Inbox  │
│ career@company.com  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Email Processing Worker          │
│                                  │
│ 1. Read unread emails            │
│ 2. Parse email                   │
│ 3. Read subject                  │
│ 4. Find job_id                   │
└──────────┬───────────────────────┘
           │
           ▼
       Is Job Valid?
           │
      ┌────┴────┐
      │         │
     YES        NO
      │         │
      ▼         ▼
 Save Email   Mark Invalid
      │
      ▼
┌──────────────────────────────┐
│ Create/Find Candidate        │
│                              │
│ Name                         │
│ Email                        │
│ Phone                        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Create Job Application       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Process Attachments          │
│                              │
│ Resume.pdf                   │
│ Cover Letter.pdf             │
└──────────────┬───────────────┘
               │
               ▼
       Is Resume Found?
           │
      ┌────┴────┐
      │         │
     YES        NO
      │         │
      ▼         ▼
 Parse Resume  Mark Incomplete
      │
      ▼
┌──────────────────────────────┐
│ Extract Resume Information   │
│                              │
│ • Name                       │
│ • Skills                     │
│ • Experience                 │
│ • Education                  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Screening Engine             │
│                              │
│ • Skill Matching             │
│ • Experience Matching        │
│ • Education Matching         │
│ • Requirement Matching       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Calculate Score              │
│                              │
│ Total: 85/100                │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Determine Status             │
│                              │
│ 85+ → Highly Recommended     │
│ 70+ → Recommended            │
│ 50+ → Manual Review          │
│ <50 → Not Recommended        │
└──────────────┬───────────────┘
               │
               ▼
        HR Dashboard
```

## 2. Overall Code Flow

Your code should not do everything inside one EmailService.

Instead:

```
EmailService
      │
      ▼
EmailProcessor
      │
      ├── JobMatcher
      │
      ├── CandidateService
      │
      ├── ApplicationService
      │
      ├── AttachmentService
      │
      └── Queue
              │
              ▼
        ResumeProcessor
              │
              ▼
        ResumeParser
              │
              ▼
        ScreeningService
```

## 3. Recommended Folder Structure

```
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── env.ts
│   ├── database.ts
│   └── queue.ts
│
├── modules/
│   │
│   ├── jobs/
│   │   ├── job.controller.ts
│   │   ├── job.service.ts
│   │   ├── job.repository.ts
│   │   └── job.routes.ts
│   │
│   ├── candidates/
│   │   ├── candidate.service.ts
│   │   └── candidate.repository.ts
│   │
│   ├── applications/
│   │   ├── application.service.ts
│   │   └── application.repository.ts
│   │
│   ├── emails/
│   │   ├── email.service.ts
│   │   ├── email.processor.ts
│   │   ├── email.parser.ts
│   │   └── email.types.ts
│   │
│   ├── attachments/
│   │   ├── attachment.service.ts
│   │   └── storage.service.ts
│   │
│   ├── resumes/
│   │   ├── resume.service.ts
│   │   ├── resume.parser.ts
│   │   ├── pdf.parser.ts
│   │   └── docx.parser.ts
│   │
│   └── screening/
│       ├── screening.service.ts
│       ├── scoring.service.ts
│       └── screening.types.ts
│
├── workers/
│   ├── email.worker.ts
│   ├── resume.worker.ts
│   └── screening.worker.ts
│
├── queues/
│   ├── email.queue.ts
│   ├── resume.queue.ts
│   └── screening.queue.ts
│
└── shared/
    ├── errors/
    ├── utils/
    └── types/
```

## 4. Application Startup Flow

When your application starts:

```
npm run dev
     │
     ▼
src/app.ts
     │
     ▼
Load Environment Variables
     │
     ▼
Connect Database
     │
     ▼
Initialize Queues
     │
     ▼
Start Workers
     │
     ▼
Start Express API
     │
     ▼
Connect Email Worker
```

Example:

```ts
// src/app.ts

import express from 'express';

import { startEmailWorker } from './workers/email.worker.js';

const app = express();

app.use(express.json());

async function bootstrap() {
    console.log('Starting Candidate Screening System...');

    await startEmailWorker();

    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

bootstrap();
```

## 5. Email Worker Code Flow

```
email.worker.ts
       │
       ▼
EmailService
       │
       ▼
Connect IMAP
       │
       ▼
Get Unread Emails
       │
       ▼
For Each Email
       │
       ▼
Add Email to Queue

```

```ts
// email.worker.ts

export async function startEmailWorker() {
    const emailService = new EmailService();

    const emails = await emailService.getUnreadEmails();

    for (const email of emails) {
        await emailQueue.add('process-email', {
            messageId: email.messageId,
        });
    }
}
```

Important: the email worker should not parse the entire resume and score the candidate directly.

It should only fetch the email and trigger the next process.

6. Email Processing Flow

```
process-email
      │
      ▼
Load Email
      │
      ▼
Save Raw Email
      │
      ▼
Parse Subject
      │
      ▼
Extract JOB-001
      │
      ▼
Find Job
      │
      ▼
Create Candidate
      │
      ▼
Create Application
      │
      ▼
Save Attachments
      │
      ▼
Add Resume Job to Queue
```

Example:

```ts
// email.processor.ts

export class EmailProcessor {
    async process(messageId: string) {
        const email = await emailService.getEmail(messageId);

        const jobInfo = emailParser.parseSubject(email.subject);

        if (!jobInfo.jobId) {
            throw new Error('Job ID not found');
        }

        const job = await jobService.findByJobId(jobInfo.jobId);

        if (!job) {
            throw new Error('Invalid Job ID');
        }

        const candidate = await candidateService.findOrCreate({
            email: email.from.email,
            name: email.from.name,
        });

        const application = await applicationService.create({
            jobId: job.id,
            candidateId: candidate.id,
        });

        for (const attachment of email.attachments) {
            const savedAttachment = await attachmentService.save(
                application.id,
                attachment,
            );

            if (savedAttachment.isResume) {
                await resumeQueue.add('process-resume', {
                    applicationId: application.id,
                    attachmentId: savedAttachment.id,
                });
            }
        }
    }
}
```

## 7. Resume Processing Flow

```
process-resume
      │
      ▼
Load Resume
      │
      ▼
Detect File Type
      │
 ┌────┴────┐
 │         │
PDF       DOCX
 │         │
 ▼         ▼
PDF Parser DOCX Parser
 │         │
 └────┬────┘
      │
      ▼
Extract Text
      │
      ▼
Extract Candidate Data
      │
      ├── Skills
      ├── Experience
      └── Education
      │
      ▼
Save Resume Data
      │
      ▼
Add Screening Job
```

Example:

```ts
// resume.processor.ts

export class ResumeProcessor {
    async process(applicationId: string, attachmentId: string) {
        const attachment = await attachmentService.findById(attachmentId);

        const text = await resumeParser.extractText(attachment);

        const resumeData = await resumeParser.parse(text);

        await resumeService.save(applicationId, resumeData);

        await screeningQueue.add('screen-candidate', {
            applicationId,
        });
    }
}
```

## 8. Resume Parser Flow

```
Raw Resume Text
       │
       ▼
Normalize Text
       │
       ▼
Extract Sections
       │
       ├── Skills
       ├── Experience
       ├── Education
       └── Projects
       │
       ▼
Normalize Skills
```

Example:

```ts
export class ResumeParser {
    async parse(text: string) {
        return {
            skills: skillExtractor.extract(text),
            experience: experienceExtractor.extract(text),
            education: educationExtractor.extract(text),
        };
    }
}
```

## 9. Screening Flow

```
screen-candidate
      │
      ▼
Load Application
      │
      ▼
Load Job Requirements
      │
      ▼
Load Candidate Resume
      │
      ▼
Compare Data
      │
      ├── Skills
      ├── Experience
      ├── Education
      └── Other Requirements
      │
      ▼
Calculate Scores
      │
      ▼
Calculate Total
      │
      ▼
Save Result
```

Example:

```ts
// screening.service.ts

export class ScreeningService {
    async screen(applicationId: string) {
        const application = await applicationService.findById(applicationId);

        const job = await jobService.findById(application.jobId);

        const resume = await resumeService.findByApplicationId(applicationId);

        const skillScore = this.calculateSkillScore(
            job.requiredSkills,
            resume.skills,
        );

        const experienceScore = this.calculateExperienceScore(
            job.minimumExperience,
            resume.totalExperience,
        );

        const educationScore = this.calculateEducationScore(
            job.minimumEducation,
            resume.education,
        );

        const totalScore = skillScore + experienceScore + educationScore;

        const recommendation = this.getRecommendation(totalScore);

        return screeningRepository.create({
            applicationId,
            skillScore,
            experienceScore,
            educationScore,
            totalScore,
            recommendation,
        });
    }
}
```

## 10. Complete Queue Flow

This is the architecture I recommend:

```
                         ┌─────────────────┐
                         │   IMAP INBOX    │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Email Worker    │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Email Queue    │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Email Processor │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌─────────────────┐         ┌─────────────────┐
           │ Database        │         │ File Storage    │
           │ Candidate       │         │ Resume          │
           │ Application     │         │ Attachments     │
           └─────────────────┘         └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Resume Queue    │
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Resume Worker   │
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Resume Parser   │
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Screening Queue │
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Screening Worker│
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Screening Engine│
                                       └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Result Database │
                                       └─────────────────┘
```

## 11. Database State Flow

Your application should track the application lifecycle.

```
RECEIVED
   │
   ▼
VALIDATING
   │
   ├── INVALID
   │
   ▼
EMAIL_PROCESSED
   │
   ▼
RESUME_PROCESSING
   │
   ├── RESUME_FAILED
   │
   ▼
RESUME_PROCESSED
   │
   ▼
SCREENING
   │
   ▼
SCREENED
   │
   ├── HIGHLY_RECOMMENDED
   ├── RECOMMENDED
   ├── MANUAL_REVIEW
   └── NOT_RECOMMENDED
```

For example:

```ts
export enum ApplicationStatus {
    RECEIVED = 'RECEIVED',
    VALIDATING = 'VALIDATING',
    INVALID = 'INVALID',
    EMAIL_PROCESSED = 'EMAIL_PROCESSED',
    RESUME_PROCESSING = 'RESUME_PROCESSING',
    RESUME_PROCESSED = 'RESUME_PROCESSED',
    SCREENING = 'SCREENING',
    SCREENED = 'SCREENED',
    FAILED = 'FAILED',
}
```

### Best practical approach

For your MVP, I would build the code flow in this exact order:

```
1. Job Module
       ↓
2. Email Inbox Reader
       ↓
3. Email Subject Parser
       ↓
4. Job Matcher
       ↓
5. Candidate + Application Creation
       ↓
6. Attachment Storage
       ↓
7. Resume Text Extraction
       ↓
8. Resume Information Extraction
       ↓
9. Screening Engine
       ↓
10. Score + Ranking
       ↓
11. React Dashboard
```

The key architecture principle is:

```
Each process should have one responsibility and communicate through queues or clearly defined service boundaries.
```

This will make your system much easier to scale later when your organization receives hundreds or thousands of applications.

The best approach is not to identify a resume using only the filename. For your screening system, use a multi-step classification strategy.

Recommended flow

```
Email
  │
  ├── attachment.pdf
  ├── cover-letter.pdf
  ├── certificate.pdf
  └── portfolio.pdf
        │
        ▼
   Attachment Processor
        │
        ├── Filename analysis
        ├── MIME/type check
        ├── Text extraction
        └── Content analysis
                │
                ▼
          Attachment Type
        ┌───────┴────────┐
        │                │
     Resume          Other
        │                │
        ▼                ▼
   Resume Parser    Store normally
```

1. First check the filename

This is a cheap first filter.

For example:

```php
private function guessAttachmentType(string $filename): string
{
    $name = strtolower($filename);

    if (preg_match(
        '/(resume|cv|curriculum[\s_-]*vitae|biodata)/i',
        $name
    )) {
        return 'resume';
    }

    if (preg_match(
        '/(cover[\s_-]*letter|motivation[\s_-]*letter)/i',
        $name
    )) {
        return 'cover_letter';
    }

    if (preg_match(
        '/(certificate|certification|transcript|academic)/i',
        $name
    )) {
        return 'certificate';
    }

    if (preg_match(
        '/(portfolio|work[\s_-]*sample)/i',
        $name
    )) {
        return 'portfolio';
    }

    return 'other';
}
```

So:

```
Newton_Mitro_CV.pdf          → resume
Newton_Resume_2026.pdf       → resume
Cover_Letter.pdf             → cover_letter
BSc_Certificate.pdf          → certificate
Portfolio.pdf                → portfolio
document.pdf                 → other
```

But don't trust this alone.

A candidate might upload:

```
document.pdf
newton.pdf
application.pdf
final.pdf
myfile.pdf
```

and it could still be a resume.
