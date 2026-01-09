#!/usr/bin/env python3
"""
Match Score Calculator for Resume Tailoring

Calculates alignment between a Master Profile and job description
based on the valuation rubric dimensions.

Usage:
    python calculate_match.py --profile profile.json --job job.json
    python calculate_match.py --interactive
"""

import json
import argparse
import re
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime


@dataclass
class MatchResult:
    """Results of profile-to-job matching analysis."""
    
    # Dimension scores (0-100)
    keyword_score: float = 0.0
    experience_score: float = 0.0
    skills_score: float = 0.0
    impact_score: float = 0.0
    recency_score: float = 0.0
    culture_score: float = 0.0
    
    # Composite
    total_score: float = 0.0
    match_tier: str = "unknown"
    
    # Details
    keywords_matched: list = field(default_factory=list)
    keywords_missing: list = field(default_factory=list)
    skills_matched: list = field(default_factory=list)
    skills_missing: list = field(default_factory=list)
    experience_direct: list = field(default_factory=list)
    experience_transferable: list = field(default_factory=list)
    experience_gaps: list = field(default_factory=list)
    
    # Flags
    overqualified: bool = False
    underqualified: bool = False
    
    # Recommendations
    recommendations: list = field(default_factory=list)


# Dimension weights from rubric
WEIGHTS = {
    "keyword": 0.25,
    "experience": 0.25,
    "skills": 0.20,
    "impact": 0.15,
    "recency": 0.10,
    "culture": 0.05
}


def extract_keywords(text: str) -> set:
    """Extract meaningful keywords from text."""
    # Common stop words to filter
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'we', 'you', 'your', 'our', 'their', 'this', 'that', 'these', 'those',
        'it', 'its', 'they', 'them', 'he', 'she', 'his', 'her', 'who', 'which',
        'what', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
        'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
        'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'about',
        'into', 'through', 'during', 'before', 'after', 'above', 'below',
        'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
        'any', 'etc', 'including', 'ability', 'experience', 'strong', 'excellent',
        'work', 'working', 'team', 'teams', 'role', 'position', 'opportunity'
    }
    
    # Extract words, normalize
    words = re.findall(r'\b[a-zA-Z][a-zA-Z0-9+#.-]*\b', text.lower())
    
    # Filter and return
    keywords = {w for w in words if w not in stop_words and len(w) > 2}
    
    # Also extract multi-word phrases (bigrams/trigrams for tools, concepts)
    phrases = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b', text)
    keywords.update(p.lower() for p in phrases)
    
    return keywords


def calculate_keyword_match(profile_text: str, job_text: str) -> tuple:
    """Calculate keyword alignment score."""
    job_keywords = extract_keywords(job_text)
    profile_keywords = extract_keywords(profile_text)
    
    matched = job_keywords & profile_keywords
    missing = job_keywords - profile_keywords
    
    if not job_keywords:
        return 0.0, list(matched), list(missing)
    
    score = (len(matched) / len(job_keywords)) * 100
    return score, list(matched), list(missing)


def calculate_skills_match(profile_skills: list, job_requirements: list) -> tuple:
    """Calculate skills coverage score."""
    profile_set = {s.lower() for s in profile_skills}
    required_set = {r.lower() for r in job_requirements}
    
    matched = profile_set & required_set
    missing = required_set - profile_set
    
    if not required_set:
        return 0.0, list(matched), list(missing)
    
    score = (len(matched) / len(required_set)) * 100
    return score, list(matched), list(missing)


def classify_experience(profile_experience: list, job_requirements: list) -> tuple:
    """Classify experience as direct, transferable, or gap."""
    direct = []
    transferable = []
    gaps = []
    
    profile_exp_text = " ".join(profile_experience).lower()
    
    for req in job_requirements:
        req_lower = req.lower()
        req_keywords = set(req_lower.split())
        
        # Check for direct match (most keywords present)
        matches = sum(1 for kw in req_keywords if kw in profile_exp_text)
        match_ratio = matches / len(req_keywords) if req_keywords else 0
        
        if match_ratio > 0.7:
            direct.append(req)
        elif match_ratio > 0.3:
            transferable.append(req)
        else:
            gaps.append(req)
    
    return direct, transferable, gaps


def calculate_composite_score(result: MatchResult) -> float:
    """Calculate weighted composite score."""
    return (
        result.keyword_score * WEIGHTS["keyword"] +
        result.experience_score * WEIGHTS["experience"] +
        result.skills_score * WEIGHTS["skills"] +
        result.impact_score * WEIGHTS["impact"] +
        result.recency_score * WEIGHTS["recency"] +
        result.culture_score * WEIGHTS["culture"]
    )


def determine_tier(score: float) -> str:
    """Determine match tier from score."""
    if score >= 75:
        return "STRONG_MATCH"
    elif score >= 50:
        return "MODERATE_MATCH"
    elif score >= 25:
        return "WEAK_MATCH"
    else:
        return "NO_MATCH"


def generate_recommendations(result: MatchResult) -> list:
    """Generate actionable recommendations based on gaps."""
    recs = []
    
    if result.keywords_missing:
        recs.append(f"Add keywords to profile: {', '.join(result.keywords_missing[:5])}")
    
    if result.skills_missing:
        recs.append(f"Skills gap - consider: {', '.join(result.skills_missing[:3])}")
    
    if result.experience_gaps:
        recs.append(f"Experience gaps to address: {', '.join(result.experience_gaps[:3])}")
    
    if result.overqualified:
        recs.append("Consider right-sizing experience presentation")
        recs.append("Generate negotiation brief for leverage")
    
    if result.underqualified:
        recs.append("Focus cover letter on transferable skills")
        recs.append("Address gaps proactively")
    
    if result.total_score < 50:
        recs.append("Consider if this role aligns with career goals")
    
    return recs


def analyze_match(
    profile_text: str,
    job_text: str,
    profile_skills: list = None,
    job_requirements: list = None,
    profile_experience: list = None,
    years_experience: int = 0,
    job_years_required: int = 0
) -> MatchResult:
    """
    Perform comprehensive profile-to-job match analysis.
    
    Args:
        profile_text: Full text of master profile
        job_text: Full text of job description
        profile_skills: List of skills from profile
        job_requirements: List of requirements from job
        profile_experience: List of experience descriptions
        years_experience: Candidate's years of experience
        job_years_required: Years required by job
    
    Returns:
        MatchResult with scores, classifications, and recommendations
    """
    result = MatchResult()
    
    # Keyword analysis
    result.keyword_score, result.keywords_matched, result.keywords_missing = \
        calculate_keyword_match(profile_text, job_text)
    
    # Skills analysis
    if profile_skills and job_requirements:
        result.skills_score, result.skills_matched, result.skills_missing = \
            calculate_skills_match(profile_skills, job_requirements)
    else:
        result.skills_score = 50.0  # Default if not provided
    
    # Experience classification
    if profile_experience and job_requirements:
        result.experience_direct, result.experience_transferable, result.experience_gaps = \
            classify_experience(profile_experience, job_requirements)
        
        total_reqs = len(job_requirements)
        if total_reqs > 0:
            direct_weight = len(result.experience_direct) / total_reqs
            transfer_weight = len(result.experience_transferable) / total_reqs * 0.6
            result.experience_score = (direct_weight + transfer_weight) * 100
    else:
        result.experience_score = 50.0
    
    # Impact score (simplified - would need metric extraction in full impl)
    # For now, estimate based on presence of numbers in profile
    numbers_in_profile = len(re.findall(r'\d+[%$KMB]?', profile_text))
    result.impact_score = min(100, numbers_in_profile * 10)
    
    # Recency score (simplified)
    result.recency_score = 70.0  # Default - would need date parsing
    
    # Culture score (simplified)
    result.culture_score = 60.0  # Default - would need sentiment analysis
    
    # Overqualification check
    if years_experience > 0 and job_years_required > 0:
        if years_experience > job_years_required * 1.5:
            result.overqualified = True
        elif years_experience < job_years_required * 0.7:
            result.underqualified = True
    
    # Calculate composite
    result.total_score = calculate_composite_score(result)
    result.match_tier = determine_tier(result.total_score)
    
    # Generate recommendations
    result.recommendations = generate_recommendations(result)
    
    return result


def format_report(result: MatchResult, job_title: str = "Unknown", company: str = "Unknown") -> str:
    """Format match result as markdown report."""
    
    tier_emoji = {
        "STRONG_MATCH": "✅",
        "MODERATE_MATCH": "⚠️",
        "WEAK_MATCH": "🟡",
        "NO_MATCH": "🚫"
    }
    
    report = f"""# Match Report: {job_title} @ {company}

## Overall Score: {result.total_score:.1f}% — {tier_emoji.get(result.match_tier, '')} {result.match_tier.replace('_', ' ')}

### Dimension Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Keyword Alignment | {result.keyword_score:.1f}% | 25% | {result.keyword_score * 0.25:.1f} |
| Experience Relevance | {result.experience_score:.1f}% | 25% | {result.experience_score * 0.25:.1f} |
| Skills Coverage | {result.skills_score:.1f}% | 20% | {result.skills_score * 0.20:.1f} |
| Quantified Impact | {result.impact_score:.1f}% | 15% | {result.impact_score * 0.15:.1f} |
| Recency Match | {result.recency_score:.1f}% | 10% | {result.recency_score * 0.10:.1f} |
| Culture Signals | {result.culture_score:.1f}% | 5% | {result.culture_score * 0.05:.1f} |

### Experience Classification

**Direct Match ({len(result.experience_direct)}):**
{chr(10).join('- ' + exp for exp in result.experience_direct[:5]) or '- None identified'}

**Transferable ({len(result.experience_transferable)}):**
{chr(10).join('- ' + exp for exp in result.experience_transferable[:5]) or '- None identified'}

**Gaps ({len(result.experience_gaps)}):**
{chr(10).join('- ' + gap for gap in result.experience_gaps[:5]) or '- None identified'}

### Skills Analysis

**Matched:** {', '.join(result.skills_matched[:10]) or 'None'}

**Missing:** {', '.join(result.skills_missing[:10]) or 'None'}

### Flags

{'⚠️ **Overqualified** — Consider negotiation leverage' if result.overqualified else ''}
{'⚠️ **Underqualified** — Address gaps in cover letter' if result.underqualified else ''}

### Recommendations

{chr(10).join('- ' + rec for rec in result.recommendations) or '- No specific recommendations'}

---
*Generated: {datetime.now().isoformat()}*
"""
    
    return report


def main():
    parser = argparse.ArgumentParser(description="Calculate profile-to-job match score")
    parser.add_argument("--profile", help="Path to profile JSON file")
    parser.add_argument("--job", help="Path to job JSON file")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")
    parser.add_argument("--output", help="Output file for report")
    
    args = parser.parse_args()
    
    if args.interactive:
        print("=== Match Score Calculator ===\n")
        print("Paste profile text (end with empty line):")
        profile_lines = []
        while True:
            line = input()
            if not line:
                break
            profile_lines.append(line)
        profile_text = "\n".join(profile_lines)
        
        print("\nPaste job description (end with empty line):")
        job_lines = []
        while True:
            line = input()
            if not line:
                break
            job_lines.append(line)
        job_text = "\n".join(job_lines)
        
        result = analyze_match(profile_text, job_text)
        print("\n" + format_report(result))
        
    elif args.profile and args.job:
        with open(args.profile) as f:
            profile_data = json.load(f)
        with open(args.job) as f:
            job_data = json.load(f)
        
        result = analyze_match(
            profile_text=profile_data.get("text", ""),
            job_text=job_data.get("text", ""),
            profile_skills=profile_data.get("skills", []),
            job_requirements=job_data.get("requirements", []),
            profile_experience=profile_data.get("experience", []),
            years_experience=profile_data.get("years", 0),
            job_years_required=job_data.get("years_required", 0)
        )
        
        report = format_report(
            result,
            job_title=job_data.get("title", "Unknown"),
            company=job_data.get("company", "Unknown")
        )
        
        if args.output:
            with open(args.output, "w") as f:
                f.write(report)
            print(f"Report saved to {args.output}")
        else:
            print(report)
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
