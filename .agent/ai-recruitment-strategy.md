# AI-Assisted Recruitment: Candidate-Side Strategy

## Research Source
**"Better Together: Quantifying the Benefits of AI-Assisted Recruitment"**
Aka, Palikot, Ansari, Yazdani (Stanford/micro1) - July 2025

---

## 📊 Key Research Findings

### Primary Results
| Metric | Traditional Pipeline | AI Pipeline | Delta |
|--------|---------------------|-------------|-------|
| Final Interview Pass Rate | 34% | 54% | +20pp |
| LinkedIn New Job (5 months) | 18% | 23% | +5.9pp |
| Candidates Reaching Final | 35 | 35 | Equal |

### What AI Recruitment Actually Evaluates

1. **Technical Skill Depth** (per skill: Not Familiar → Junior → Mid → Senior)
   - Not just "do you list React" but "can you discuss React architecture decisions?"
   - Requires probing questions about *practical application*
   - Tests *problem-solving approach* not just knowledge

2. **Conversational Quality** (2 SD higher importance than human interviews)
   - Dialogue flow and natural engagement
   - Response building (how you build on follow-ups)
   - Acknowledgment patterns

3. **Soft Skills Rating** (separate dimension)
   - Communication clarity
   - Professional demeanor
   - Engagement level

4. **Proctoring Score** (≥70% required)
   - Video on, focused, no tab-switching
   - Commitment signal

5. **Resume Score** (0-100, keyword-based ML)
   - Still matters for initial screening
   - But AI Score captures *different* signals

---

## 🎯 Who Benefits from AI Screening?

### Demographics that GAIN advantage:
- **Younger candidates** (avg 24.2 vs 27.0 years)
- **Less experienced** (2.72 vs 5.62 years)
- **Master's degree holders** (higher representation in "benefits from AI" group)
- **Those with lower Resume Scores** who can demonstrate actual skill

### Demographics that LOSE advantage:
- **Older candidates** with extensive experience
- **Those with high Resume Scores** but shallow depth
- **Keyword-stacked resumes** without demonstrable skill

**Insight**: AI levels the playing field by testing *actual ability* rather than *credential accumulation*.

---

## ⚠️ Skill Misrepresentation Detection

### The Problem
- 21.3% of candidates misrepresent at least 1 skill
- 12.4% misrepresent 2+ skills
- 7.5% claim all 3 required skills they don't have

### How AI Catches This
1. Resume claims: "React, JavaScript, CSS"
2. AI asks probing questions about each
3. AI rates: "Not Familiar" despite resume claim
4. Candidate flagged for skill inflation

### Candidate Strategy
**DO NOT INFLATE SKILLS.** Instead:
- Be honest about proficiency levels
- Articulate *learning trajectory* for gaps
- Emphasize transferable patterns
- Show *potential* not just current state

---

## 🔧 Self-Selection Dynamics

### Completion Rates
- 24% of invited candidates complete AI interview
- 76% drop out before completion

### Who Drops Out?
- Slightly older candidates
- More experienced candidates
- Similar Resume Scores to completers
- **Similar labor market outcomes** (not "better candidates avoiding AI")

### What Completion Signals
- Motivation / active job search
- Willingness to invest 40 minutes
- Comfort with AI systems
- Seriousness about the role

**Strategy**: Complete AI interviews when invited. The completion itself is a positive signal.

---

## 📐 The Two-Score Reality

Every candidate has TWO scores:
1. **Resume Score** (0-100): Keyword-based ML matching
2. **AI Score** (0-9): Sum of skill ratings from AI interview

### They Measure Different Things

| Resume Score Captures | AI Score Captures |
|----------------------|-------------------|
| Keyword density | Skill depth |
| Credential listing | Practical application |
| Experience breadth | Problem-solving approach |
| Static document | Dynamic dialogue |
| What you claim | What you demonstrate |

### The Gap Matters
- Same person can rank **top tercile** on Resume Score but **bottom tercile** on AI Score
- Or vice versa
- The delta between these scores reveals preparation gaps

---

## 🎬 Interview Quality Dimensions

### Technical Question Quality (AI scores 0.5 SD higher)
**What it measures:**
- Skill alignment with job requirements
- Logical progression of difficulty
- Question clarity

**For candidates, this means:**
- AI asks structured, logical progressions
- Answers should build coherently
- Technical depth is tested systematically

### Conversational Quality (AI scores 2 SD higher)
**What it measures:**
- Dialogue flow
- Response building on prior answers
- Acknowledgment patterns

**For candidates, this means:**
- Don't give robotic answers
- Build on what you've said before
- Engage naturally, not scripted
- Acknowledge the question before answering

---

## 🧪 Reverse-Engineering the AI Interview

### The micro1 AI Recruiter Structure
1. **Experience & Knowledge Probing**
   - "How deeply do you understand X?"
   - "Describe your experience with Y"

2. **Practical Application Questions**
   - "How have you applied X in prior projects?"
   - "Walk me through a specific implementation"

3. **Problem-Solving Scenarios**
   - Coding challenges (for technical roles)
   - Scenario-based prompts
   - Architecture decision questions

### Skill Rating Rubric (per skill)
| Rating | Criteria |
|--------|----------|
| Not Familiar | Cannot discuss, no practical experience |
| Junior | Basic understanding, limited application |
| Mid-level | Solid experience, independent work |
| Senior | Deep expertise, teaches others, architectural decisions |

### Pass Criteria (from paper)
- All required skills at Mid-level or higher
- Proctoring score ≥ 70%
- Soft skills at Mid-level or higher
- Minimum 2 years relevant experience

---

## 🛠️ Implementation Opportunities

### For CareerCoachAntigravity

#### 1. AI Interview Simulator
**Purpose**: Practice structured AI interviews before real ones
**Features**:
- Skill-based question progressions
- Conversational flow scoring
- Technical depth probing
- Real-time feedback

#### 2. Resume Score ↔ AI Score Gap Analyzer
**Purpose**: Show where candidates rank differently
**Features**:
- Parse Master Profile for claimed skills
- Simulate AI interview questions for each
- Score depth of articulation
- Identify preparation gaps

#### 3. Skill Depth Articulation Framework
**Purpose**: Transform skill claims into demonstrable narratives
**Features**:
- For each claimed skill:
  - Experience depth (projects, years)
  - Practical application examples
  - Problem-solving stories
  - Teaching/mentoring examples

#### 4. Conversational Quality Trainer
**Purpose**: Improve dialogue flow in AI interviews
**Features**:
- Practice natural response patterns
- Eliminate filler words
- Build response coherence
- Acknowledgment practice

#### 5. Completion Commitment Tracker
**Purpose**: Track AI interview invitations and completions
**Features**:
- Log all AI interview invitations
- Track completion rates
- Analyze patterns in drop-offs
- Optimize completion strategy

---

## 📋 Strategic Recommendations

### For Dico Angelo's Job Search

1. **Embrace AI Interviews**
   - You're in the "benefits from AI" demographic (technical + systems focus)
   - Your Master Profile shows *depth* that resumes can't capture
   - Complete every AI interview invited to

2. **Prepare for Skill Probing**
   - For each skill you claim, prepare:
     - 2-3 specific project examples
     - Architecture decisions you made
     - Problems you solved
     - How you'd teach it to someone else

3. **Optimize for Both Scores**
   - Resume: Maintain keyword density for initial screening
   - AI readiness: Prepare depth narratives for each keyword

4. **Use Your Hybrid Advantage**
   - Your "Architect-Operator Hybrid" positioning works well for AI
   - AI can detect the systems thinking that resumes miss
   - Your Metaventions work demonstrates *building* not just *claiming*

5. **Leverage the 4Ds Framework**
   - Your AI Fluency Criteria maps to how AI evaluates depth
   - Demonstrate: building capability
   - Deploy: production experience
   - Discern: judgment and quality
   - Direct: teaching and architecture

---

## 🚀 Phase 1 Implementation Plan

### Week 1-2: Foundation
- [ ] Create AI Interview Skill Depth Framework
- [ ] Map Master Profile skills to depth narratives
- [ ] Build question bank for each skill category
- [ ] Design conversational flow scoring rubric

### Week 3-4: Simulation Engine
- [ ] Build AI Interview Simulator component
- [ ] Integrate with existing chat infrastructure
- [ ] Add skill-based question progression
- [ ] Implement conversational quality metrics

### Week 5-6: Analysis Tools
- [ ] Resume Score estimation algorithm
- [ ] AI Score prediction based on skill narratives
- [ ] Gap visualization dashboard
- [ ] Preparation priority recommendations

### Week 7-8: Integration
- [ ] Connect to Master Profile
- [ ] Add to Career Board sessions
- [ ] Create "Interview Prep" session type
- [ ] Track preparation progress

---

## 📚 Reference: Key Paper Quotes

> "AI interviews capture dimensions of candidate quality not visible through traditional resume screening"

> "Treatment effects are particularly pronounced for younger candidates with fewer years of professional experience"

> "The AI interview exposes widespread skill inflation that resume screens overlook"

> "AI scores 0.5 standard deviations higher in technical question quality and 2 standard deviations higher on conversational flow"

> "Dashboards don't win deals; correct reality delivered at speed does" - (from Dico's profile, but applies here)

---

## 🎯 Success Metrics

| Metric | Target |
|--------|--------|
| Skill depth coverage | 100% of claimed skills have narratives |
| Conversational practice | 10+ simulated interviews before real ones |
| Resume-AI gap | <10% rank differential |
| AI interview completion rate | 100% when invited |
| Final interview pass rate | Target 54%+ (AI pipeline benchmark) |

---

*Strategy document created: 2026-01-08*
*Based on: Aka et al. (2025) - Stanford/micro1 Field Experiment*
