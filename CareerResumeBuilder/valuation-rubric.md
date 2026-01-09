# Valuation Rubric

Comprehensive scoring system for profile-to-job matching.

## Scoring Dimensions

### 1. Keyword Alignment (25%)

Match job description language exactly.

| Score | Criteria |
|-------|----------|
| 90-100 | All critical keywords addressable with exact or near-exact matches |
| 70-89 | Most keywords addressable, minor terminology gaps |
| 50-69 | Core keywords present, several secondary gaps |
| 30-49 | Significant keyword gaps in requirements |
| 0-29 | Fundamental mismatch in domain language |

**Keyword Categories:**
- Job title / role variations
- Required technical skills
- Industry terminology
- Soft skill descriptors
- Tool/platform names
- Certifications mentioned

### 2. Experience Relevance (25%)

Assess direct vs. transferable experience.

| Score | Criteria |
|-------|----------|
| 90-100 | Direct experience in same role/industry, exceeds years required |
| 70-89 | Direct experience meets requirements OR strong transferable with same level |
| 50-69 | Transferable experience with clear connection, may need framing |
| 30-49 | Tangential experience, significant stretch required |
| 0-29 | No relevant experience pathway |

**Classification:**
- ✅ **Direct**: Same role title, same industry, same responsibilities
- ⚠️ **Transferable**: Different context, same core skills applied
- 🚫 **Gap**: Required but absent from profile

### 3. Skills Coverage (20%)

Hard skills + soft skills + tools.

| Score | Criteria |
|-------|----------|
| 90-100 | All required skills present, most preferred skills present |
| 70-89 | All required present, some preferred missing |
| 50-69 | Most required present, critical gap in 1-2 areas |
| 30-49 | Multiple required skills missing |
| 0-29 | Fundamental skills mismatch |

**Skill Tiers:**
- **Required**: Explicitly stated as necessary
- **Preferred**: Listed as nice-to-have
- **Implicit**: Industry-standard assumptions

### 4. Quantified Impact (15%)

Measurable achievements available.

| Score | Criteria |
|-------|----------|
| 90-100 | Strong metrics for all relevant experience (revenue, %, time, scale) |
| 70-89 | Metrics for most experience, some bullets need strengthening |
| 50-69 | Some quantified achievements, several vague descriptions |
| 30-49 | Few metrics, mostly responsibility-focused |
| 0-29 | No quantified impact available |

**Strong Metrics Include:**
- Revenue/cost impact ($)
- Percentage improvements (%)
- Scale indicators (team size, user count, transaction volume)
- Time savings (hours, days, cycles)
- Rankings/awards (top X%, #1 in category)

### 5. Recency Match (10%)

Timeline and seniority alignment.

| Score | Criteria |
|-------|----------|
| 90-100 | Current/recent experience at appropriate seniority level |
| 70-89 | Recent experience, slight seniority adjustment needed |
| 50-69 | Relevant experience 3-5 years old, or level mismatch |
| 30-49 | Best experience >5 years old, significant level gap |
| 0-29 | Outdated experience or extreme seniority mismatch |

**Seniority Signals:**
- Years of experience requested
- Management/leadership mentions
- Scope indicators (team size, budget, P&L)
- Title level (specialist, manager, director, VP)

### 6. Culture Signals (5%)

Values and work style alignment.

| Score | Criteria |
|-------|----------|
| 90-100 | Clear alignment with stated company values, style matches |
| 70-89 | General alignment, minor style adjustments possible |
| 50-69 | Neutral — no strong signals either direction |
| 30-49 | Some misalignment in stated preferences |
| 0-29 | Clear culture mismatch (startup vs. enterprise, etc.) |

**Culture Indicators:**
- Company mission/values statements
- Work environment descriptors (fast-paced, collaborative, autonomous)
- Team structure hints
- Communication style expectations

---

## Composite Scoring

```
Final Score = (Keyword × 0.25) + (Experience × 0.25) + (Skills × 0.20) 
            + (Impact × 0.15) + (Recency × 0.10) + (Culture × 0.05)
```

## Match Tiers

| Tier | Score | Action |
|------|-------|--------|
| **Strong Match** | 75-100% | Full generation, high confidence |
| **Moderate Match** | 50-74% | Generate with stretch warnings, address gaps |
| **Weak Match** | 25-49% | Advise caution, profile improvement needed |
| **No Match** | 0-24% | Do not apply, fundamentally misaligned |

## Overqualification Detection

Trigger negotiation brief when:
- Years of experience exceed requirement by >50%
- Seniority level exceeds role by 1+ levels
- Multiple "preferred" skills are strengths
- Previous scope significantly exceeds role scope

## Gap Classification

For each gap identified:

```
GAP: [Requirement]
Type: Hard Skill | Soft Skill | Experience | Certification | Tool
Severity: Critical | Important | Nice-to-have
Addressable: Yes (with training) | Partial (transferable angle) | No
Recommendation: [Specific action to close gap]
```
