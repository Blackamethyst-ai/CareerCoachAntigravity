---
name: tailor-resume
description: AI-powered resume tailoring system that matches a comprehensive Master Profile against job descriptions to generate optimized, ATS-friendly resumes. Use when user needs to tailor a resume for a specific job, analyze job-profile fit, generate cover letters, prepare interview talking points, or assess negotiation leverage. Triggers on requests involving resume customization, job applications, career document optimization, or profile-to-job matching.
---

# Tailor Resume Skill

Transform a Master Profile into targeted, high-impact resumes optimized for specific opportunities.

## Pipeline Overview

```
INPUTS                    PROCESS                         OUTPUTS
─────────────────────────────────────────────────────────────────────
Master Profile ──┐                                    ┌── tailored_resume.docx
                 ├──► Parse ──► Match ──► Generate ──┼── match_report.md
Job Description ─┤                                    ├── cover_letter.md (opt)
                 │                                    ├── interview_prep.md (opt)
Target Criteria ─┘                                    ├── negotiation_brief.md (opt)
                                                      └── application_log.json
```

## Workflow

### Step 1: Gather Inputs

**Required:**
- `master_profile.md` — User's comprehensive career document (see `assets/master-profile-template.md`)
- Job description — Either URL (fetch) or pasted text

**Optional:**
- `target_criteria.yaml` — Ideal role parameters (see `assets/target-criteria-template.yaml`)
- Company URL — For additional context alignment

If Master Profile doesn't exist, help user create one using the template.

### Step 2: Parse & Analyze

**Parse Master Profile into sections:**
- Contact & links (including location strategy and visa status)
- Career arc visualization (phase progression)
- Professional summary archetypes (multiple variants)
- Experience entries (with STAR achievements, Section Insights, Title Notes)
- Key metrics summary table
- Skills inventory (hard/soft/tools)
- Education & certifications (with accuracy notes)
- Projects & portfolio
- Narrative blocks (pre-written cover letter paragraphs)
- Target preferences (including visa requirements)
- Positioning notes (reframing guidance, company angles)

**Analyze Job Description:**
- Extract must-have requirements
- Extract nice-to-have requirements
- Identify keywords (exact language to mirror)
- Note company culture signals
- Identify seniority level indicators
- Extract location/remote requirements
- Note compensation signals if present

### Step 3: Calculate Match Score

Score against `references/valuation-rubric.md` dimensions:

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| Keyword Alignment | 25% | % of job keywords addressable |
| Experience Relevance | 25% | Direct/transferable/gap ratio |
| Skills Coverage | 20% | Hard + soft + tools match |
| Quantified Impact | 15% | STAR achievements present |
| Recency Match | 10% | Timeline/seniority fit |
| Culture Signals | 5% | Company values alignment |

**Match Threshold Gate:**
- **Score ≥ 75%**: Proceed with full generation
- **Score 50-74%**: Generate with gap warnings + stretch strategy
- **Score < 50%**: Advise against applying, recommend profile improvements

### Step 4: Generate Outputs

#### Primary: Tailored Resume

**4a. Select Summary Archetype**
If Master Profile contains multiple summary archetypes, select the one best aligned with the target role type:
- Technical/Builder roles → Technical archetype
- Operations/Systems roles → Operations archetype  
- Leadership roles → Strategy archetype
- Industry-specific → Matching industry archetype

**4b. Apply Strategic Positioning**
- Check for visa/work authorization requirements — include if specified in target criteria
- Check location strategy — use resume_display from target criteria, not raw location
- Check for title reframing notes — use actual scope, not diminished titles

**4c. Build Resume Content**
1. Insert selected summary archetype (customized to specific role)
2. Prioritize most relevant experience based on match analysis
3. Pull achievements using "Section Insight" notes for narrative coherence
4. Transform bullets using STAR method (see `references/star-method.md`)
5. Mirror exact job description keywords (see `references/ats-optimization.md`)
6. Curate skills section to match requirements (most relevant first)
7. Include relevant certifications and education
8. Apply ATS formatting rules

Output as `.docx` with clean, parseable formatting.

#### Secondary: Match Report

Include score breakdown, transferability notes, gap analysis, and recommendations.

#### Optional: Cover Letter

Structure: Hook → Value proposition (2-3 achievements) → Company alignment → Call to action

#### Optional: Interview Prep

Generate STAR talking points for each matched experience, anticipated questions based on gaps, and smart questions to ask.

#### Optional: Negotiation Brief

Generate when experience exceeds requirements. Include leverage analysis, overqualification areas, and positioning recommendations.

### Step 5: Log Application

Append entry to `application_log.json` with job details, match score, outputs generated, and status tracking.

### Step 6: Profile Evolution Prompt

After each cycle, prompt user for new achievements, skills, or feedback to incorporate.

## Anti-Hallucination Rules

**CRITICAL:**
1. Only use content from Master Profile — never fabricate
2. Reframe ≠ Invent — transferable framing must reference REAL experience
3. Flag gaps honestly — don't fill what doesn't exist
4. Preserve quantification integrity — only use actual numbers
5. Maintain timeline accuracy — never alter dates

## Reference Files

- `references/valuation-rubric.md` — Full scoring criteria
- `references/star-method.md` — Achievement transformation
- `references/ats-optimization.md` — Keyword + format rules
- `references/action-verbs.md` — Power verbs by category
- `references/red-flags.md` — Anti-patterns to avoid
- `references/ai-fluency-criteria.md` — 4Ds evaluation framework

## AI Fluency Footer

Every output includes:
```
───────────────────────────────────────
AI-Assisted Document | Review Required
Source: Master Profile → [Job Title] @ [Company]
Match Score: [X]%
Generated: [timestamp]
Human verification required before submission.
───────────────────────────────────────
```

## Edge Cases

- **Employment Gaps**: Acknowledge productively, never hide
- **Career Pivots**: Lead with transferable skills, use summary for narrative
- **Overqualification**: Auto-generate negotiation brief, consider right-sizing
- **Remote/Location**: Flag mismatches, suggest positioning language
- **Visa/Work Authorization**: If specified in target criteria as non-negotiable, include prominently in contact section and verify job offers sponsorship before applying
- **Under-titled Roles**: Use "Title Note" from profile to present actual scope, not diminished official title
- **Education Accuracy**: Never inflate degrees (e.g., don't claim MBA if it's a BBA) — verify against profile's accuracy notes
