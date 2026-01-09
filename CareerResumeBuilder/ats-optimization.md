# ATS Optimization Guide

Rules for Applicant Tracking System compatibility.

## How ATS Works

1. Parses resume text into structured fields
2. Extracts keywords and phrases
3. Matches against job requisition criteria
4. Scores and ranks candidates
5. Surfaces top matches to recruiters

**Key Insight:** ATS reads your resume as plain text first. Design for machines, then beautify for humans.

## Format Rules

### ✅ ATS-Safe Formatting

- **File type:** .docx preferred, PDF acceptable (text-based, not image)
- **Fonts:** Standard fonts (Arial, Calibri, Times New Roman, Georgia)
- **Font size:** 10-12pt body, 14-16pt headers
- **Margins:** 0.5" to 1" standard
- **Sections:** Clear headers matching expected categories
- **Bullets:** Simple bullets (•) or hyphens
- **Dates:** Consistent format (MMM YYYY or MM/YYYY)

### ❌ ATS-Breaking Elements

- Tables or columns (text order gets scrambled)
- Text boxes or floating elements
- Headers/footers (often ignored by parsers)
- Images, logos, or graphics
- Custom fonts or icons
- Unusual characters or symbols
- Invisible text or white-on-white keywords

## Section Naming

Use expected headers ATS looks for:

| Use This | Not This |
|----------|----------|
| Professional Experience | Career Journey |
| Work Experience | Where I've Been |
| Education | Academic Background |
| Skills | What I Bring |
| Summary | Who I Am |
| Certifications | Credentials |

## Keyword Strategy

### Extraction Process

From job description, extract:

1. **Job title variations** — exact title + industry alternates
2. **Hard skills** — technical requirements
3. **Soft skills** — interpersonal/leadership terms
4. **Tools/platforms** — specific software mentioned
5. **Certifications** — required or preferred credentials
6. **Industry terms** — domain-specific vocabulary

### Keyword Placement

**High-weight areas:**
- Job titles in experience section
- Skills section
- First third of resume
- Section headers

**Keyword density:**
- Include critical keywords 2-3 times naturally
- Don't stuff — readability matters
- Exact match preferred over variations

### Example Mapping

**Job Description Says:**
> "5+ years program management experience... cross-functional collaboration... 
> Salesforce, Microsoft ecosystem... partner ecosystem development"

**Your Resume Includes:**
- "Program Manager" or "Program Management" in title/summary
- "Cross-functional teams" in experience bullets
- "Salesforce" and "Microsoft" in skills or achievements
- "Partner ecosystem" verbatim in relevant bullets

## Keyword Mirroring

Use **exact language** from job descriptions:

| JD Says | Mirror Exactly |
|---------|----------------|
| "project management" | "project management" (not "managing projects") |
| "cross-functional teams" | "cross-functional teams" (not "interdepartmental") |
| "revenue operations" | "revenue operations" (not "RevOps" unless both used) |
| "Salesforce" | "Salesforce" (not "CRM platform") |

## Skills Section Optimization

Structure for ATS parsing:

```
SKILLS
───────
Technical: Salesforce, Microsoft Azure, AWS, CRM Governance, 
           Process Engineering, Data Analysis

Tools: Workday, Jira, Confluence, Tableau, SQL, Python

Domain: Partner Ecosystem Operations, Revenue Operations (RevOps), 
        Cloud Infrastructure, Agentic Systems

Leadership: Cross-functional Collaboration, Stakeholder Management,
            Program Management, Team Leadership
```

**Tips:**
- Match job's skill categorization if visible
- List most relevant skills first
- Include both acronyms and full terms (SQL/Structured Query Language)
- Avoid rating scales (ATS can't interpret "Advanced Python")

## Resume Length

**ATS doesn't care about page count, humans do.**

- **1 page:** <5 years experience, early career
- **2 pages:** 5-15 years, multiple relevant roles
- **3+ pages:** Executive/academic/federal (rare)

For tailored resumes, trim to relevant content. Irrelevant experience can be compressed or removed.

## Testing ATS Compatibility

Before submission:

1. Save as .txt file
2. Review for scrambled content
3. Verify all sections retained
4. Check keyword presence
5. Confirm dates parsed correctly

## Common ATS Systems

Awareness helps but doesn't change strategy:
- Workday
- Greenhouse
- Lever
- iCIMS
- Taleo
- BambooHR
- ADP

Each has quirks, but core rules apply universally.

## Red Flags for ATS

The system may flag or reject resumes with:
- No contact information detected
- Missing required keywords
- Employment gaps >6 months (timeline parsing)
- Job title mismatch from role applied
- Location mismatch (if geo-restricted)
- File parsing errors

## Hybrid Approach

**Optimize for both:**

```
MACHINE (ATS)              →    HUMAN (Recruiter)
─────────────────────────────────────────────────
Keywords present           →    Easy to scan
Clean parsing              →    Visual hierarchy
Sections labeled           →    Compelling narrative
Skills extracted           →    Impact evident
```

Best resumes satisfy both audiences.
