# Career Board: Antigravity

[![Agentic Status: Active](https://img.shields.io/badge/Agentic%20Status-Active-00C853?style=for-the-badge&logo=robot)](./.agent/README.md)
[![Innovation: Scouted](https://img.shields.io/badge/Innovation-Scouted-7C4DFF?style=for-the-badge&logo=sparkles)](./.agent/subagent_logs.md)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

## A Human-AI Career Governance System
**Purpose:** Catch career drift early by forcing receipts and decisions through structured AI-assisted accountability.

> **🤖 Agent-Ready Repository**: This codebase includes a dedicated [Agent Context](./.agent/README.md) to help LLMs understand and navigate the project structure instantly.

---

## ⚡️ Dynamic Agentic Context
*This section evolves as the project grows.*

| Context Layer | Status | Link |
| :--- | :--- | :--- |
| **Cognitive State** | 🟢 Online | [.agent/README.md](./.agent/README.md) |
| **Research Memory** | 🧠 Updated | [.agent/subagent_logs.md](./.agent/subagent_logs.md) |
| **Workflows** | 3 Active | `/deep-research`, `/innovation-scout`, `/remember` |

---

## System Overview

Career Board operates in three interaction modes:

| Mode | Trigger | Human Input | AI Role |
|------|---------|-------------|---------|
| **Automated** | Weekly schedule | None required | Proactive prompts, reminders, bet tracking |
| **Augmented** | On-demand | Documents, context, responses | Synthesis, analysis, questioning |
| **Agentic** | Tool-triggered | Approval/override | Calendar checks, artifact verification, notifications |

---

## Architecture

```
career-board/
├── app/
│   ├── api/
│   │   ├── chat/              # Conversational endpoints
│   │   ├── portfolio/         # CRUD for problem portfolio
│   │   ├── quarterly/         # Quarterly review workflow
│   │   ├── weekly/            # Automated weekly check-ins
│   │   └── webhooks/          # External integrations
│   ├── components/
│   │   ├── Chat.tsx           # Main conversational interface
│   │   ├── Portfolio.tsx      # Problem portfolio display/edit
│   │   ├── BoardRoles.tsx     # Board role configuration
│   │   ├── QuarterlyReport.tsx
│   │   ├── WeeklyPulse.tsx
│   │   └── ReceiptTracker.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── prompts.ts     # System prompts by mode
│   │   │   ├── tools.ts       # Tool definitions for agentic mode
│   │   │   └── workflows.ts   # Multi-step conversation flows
│   │   ├── db/
│   │   │   └── schema.ts      # Data models
│   │   ├── scheduler/
│   │   │   └── cron.ts        # Automated triggers
│   │   └── integrations/
│   │       ├── calendar.ts    # Google/Outlook calendar
│   │       ├── documents.ts   # File processing
│   │       ├── notifications.ts
│   │       └── career-intelligence/ # Career analyics module (New)
│   │           ├── skill-graph.ts   # Skill network & gaps
│   │           ├── linkedin-signals.ts
│   │           └── response-embeddings.ts
│   ├── page.tsx
│   ├── resume-builder/        # Chameleon Engine & Resume Tools
│   │   └── page.tsx
│   └── career-intelligence/   # Positioning Playbook & Strategy
│       └── page.tsx
├── data/
│   ├── portfolio.json         # Problem portfolio storage
│   ├── board-roles.json       # Board role definitions
│   ├── bets.json              # Prediction tracking
│   ├── receipts.json          # Evidence log
│   └── sessions/              # Conversation history
├── docs/
│   └── prompts/               # Prompt templates
└── .env.local                 # API keys, config
```

---

## Data Models

### Problem Portfolio

```typescript
interface Problem {
  id: string;
  name: string;
  whatBreaks: string;
  scarcitySignals: {
    type: 'escalated' | 'faster_trusted' | 'only_one' | 'unknown';
    detail?: string;
  }[];
  direction: {
    aiCheaper: { answer: boolean | null; quote: string };
    errorCost: { trend: 'rising' | 'falling' | 'flat'; quote: string };
    trustRequired: { answer: boolean; quote: string };
    classification: 'appreciating' | 'depreciating' | 'stable' | 'stable_uncertain';
    reason: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Portfolio {
  problems: Problem[];
  risk: string;
  lastReviewed: Date;
}
```

### Board Roles

```typescript
interface BoardRole {
  id: string;
  type: 'accountability' | 'market_reality' | 'avoidance' | 'long_term' | 'devils_advocate';
  anchoredTo: string; // Problem ID
  question: string;
  lastAsked: Date;
  responses: {
    date: Date;
    response: string;
    receipts: Receipt[];
  }[];
}
```

### Receipts & Evidence

```typescript
interface Receipt {
  id: string;
  type: 'decision' | 'artifact' | 'calendar' | 'proxy';
  strength: 'strong' | 'medium' | 'weak';
  description: string;
  evidence: string; // URL, file path, or description
  linkedTo: string; // Problem ID or Bet ID
  date: Date;
}
```

### Bets & Predictions

```typescript
interface Bet {
  id: string;
  quarter: string; // "Q1 2025"
  prediction: string;
  wrongIf: string;
  result?: 'happened' | 'didnt' | 'partial';
  evidence?: string;
  resolvedAt?: Date;
}
```

### Avoided Decisions

```typescript
interface AvoidedDecision {
  id: string;
  what: string;
  whyAvoiding: string;
  cost: string;
  surfacedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}
```

### Chameleon Engine

```typescript
interface ChameleonMetrics {
  metric: string;
  original: string;
  rewritten: string;
  archetype: 'speed' | 'safety' | 'ecosystem' | 'creative' | 'general';
}
```

### Skill Graph

```typescript
interface SkillNode {
  id: string;
  category: SkillCategory;
  demandScore: number;
  growthRate: number;
}
```

---

## Interaction Modes

### Mode 1: Automated (Weekly Pulse)

**Trigger:** Cron job every Monday 9am (configurable)

**Workflow:**
```
1. Load current portfolio, active bets, avoided decisions
2. Generate weekly pulse prompt
3. Send notification with 3 questions:
   - Receipt check: "Any artifacts shipped this week?"
   - Avoidance check: "Status on [avoided decision]?"
   - Bet check: "Any evidence for/against [active bet]?"
4. Store responses
5. Flag if no response within 48 hours
```

**System Prompt:**
```markdown
You are the Career Board running a weekly pulse check. Be brief and direct.

CONTEXT:
- Portfolio: {{portfolio}}
- Active bet: {{currentBet}}
- Avoided decision: {{avoidedDecision}}

Ask exactly 3 questions:
1. What artifact or decision did you ship this week? (Name it specifically or say "none")
2. {{avoidedDecision.what}} — any movement? What's blocking it?
3. Any evidence this week that {{currentBet.prediction}} is happening or not?

If any answer is vague, ask for one concrete example before accepting it.
Output a 2-line summary and flag anything that needs attention.
```

### Mode 2: Augmented (Human-Initiated)

**Trigger:** User opens chat, uploads document, or requests session

**Capabilities:**
- Process uploaded documents (calendar exports, project docs, emails)
- Extract potential receipts from documents
- Run Setup flow for new portfolios
- Run Quarterly review with document context
- Answer portfolio questions with full context

**Document Processing Pipeline:**
```
1. Accept upload (PDF, DOCX, ICS, CSV, TXT)
2. Extract text content
3. Identify receipt candidates:
   - Meetings with decisions noted
   - Shipped artifacts mentioned
   - Feedback received
   - Metrics/outcomes referenced
4. Present extracted receipts for confirmation
5. Link confirmed receipts to problems/bets
```

**System Prompt (Setup Mode):**
```markdown
You are helping set up career governance. Ask ONE question at a time. Wait for the answer.

RULES:
- If any answer is vague, stop and ask for one concrete example
- Do not move forward until current question has a specific answer
- Quote the user's words when filling direction fields

PART 1: PROBLEM PORTFOLIO
Get 3-5 problems. For each:
1. Name the problem
2. What breaks if it isn't solved well
3. Scarcity signals (pick 2):
   - People escalate to me when high-stakes
   - Others can do it, but I'm faster/more trusted
   - I'm the only one who can do it reliably
   - Unknown — [reason]
4. Direction questions:
   - Is AI making this faster/cheaper to produce?
   - Is the cost of getting it wrong rising or falling?
   - Does it require trust/judgment/context that doesn't transfer?

After each problem, output the direction table and classification.

GATE: Do not proceed to Part 2 until 3-5 problems are complete with all fields.

PART 2: BOARD ROLES
Create 5 roles anchored to specific problems:
- Accountability: what receipts to demand
- Market Reality: what direction label to challenge
- Avoidance: what decision to probe
- Long-term Positioning: what 5-year question to ask
- Devil's Advocate: what case against current path

OUTPUT FORMAT:
{{portfolioFormat}}
```

**System Prompt (Quarterly Mode):**
```markdown
You are running a quarterly board meeting. Produce a complete BOARD REPORT.

CONTEXT:
- Portfolio: {{portfolio}}
- Board Roles: {{boardRoles}}
- Last Bet: {{lastBet}}
- Available Documents: {{documentSummary}}

RECEIPT HIERARCHY:
- Decision/Artifact = strong
- Calendar-only = weak (note it)
- Proxy = medium

PROCESS (ask one at a time):
1. Last bet — what happened? Evidence?
2. Commitments — what receipts? (Check against uploaded documents)
3. Avoided decision — what specific conversation/risk/conflict?
4. Comfort work — what did you choose because it was safe?
5. Portfolio — any direction shifts based on this quarter?
6. Next bet — what prediction? What would prove it wrong?

GATES:
- Challenge vague claims with "Give me one specific example"
- Comfort work cannot be "email" or "meetings" — ask what harder thing was avoided
- Bet must be falsifiable with explicit "wrong if" criteria

Have each board role ask their anchored question. Be direct.

OUTPUT FORMAT:
{{quarterlyFormat}}
```

### Mode 3: Agentic (Tool-Enabled)

**Trigger:** AI determines tool use is needed, or user requests verification

**Available Tools:**

```typescript
const tools = [
  {
    name: "check_calendar",
    description: "Verify if a meeting or time block exists in the user's calendar",
    parameters: {
      query: "string - what to search for",
      dateRange: "string - time period to check"
    }
  },
  {
    name: "search_artifacts",
    description: "Search connected document sources for shipped work",
    parameters: {
      query: "string - artifact description",
      sources: "array - which sources to check (drive, github, notion, etc.)"
    }
  },
  {
    name: "send_reminder",
    description: "Schedule a reminder about an avoided decision or bet",
    parameters: {
      message: "string - reminder content",
      timing: "string - when to send"
    }
  },
  {
    name: "log_receipt",
    description: "Record a receipt with evidence",
    parameters: {
      type: "decision | artifact | calendar | proxy",
      description: "string",
      evidence: "string - URL or description",
      linkedTo: "string - problem or bet ID"
    }
  },
  {
    name: "update_bet_status",
    description: "Mark a bet as resolved with evidence",
    parameters: {
      betId: "string",
      result: "happened | didnt | partial",
      evidence: "string"
    }
  },
  {
    name: "flag_drift",
    description: "Create an alert when portfolio direction may be shifting",
    parameters: {
      problemId: "string",
      signal: "string - what indicates the shift",
      suggestedAction: "string"
    }
  }
];
```

**Agentic System Prompt:**
```markdown
You are Career Board with tool access. Use tools to verify claims and gather evidence.

TOOL USE PRINCIPLES:
- When user claims a receipt, verify it if possible
- When checking bet status, search for concrete evidence
- When user seems to be avoiding, schedule follow-up reminders
- Log all verified receipts automatically
- Flag portfolio drift when you notice patterns

VERIFICATION WORKFLOW:
User: "I shipped the Q3 analysis"
→ Call search_artifacts to find it
→ If found: log_receipt with link
→ If not found: ask for specific location

DRIFT DETECTION:
If user's responses suggest a "depreciating" problem is getting more time, or an "appreciating" problem is being neglected:
→ Call flag_drift with specific observation
→ Have Market Reality board role address it

REMINDER LOGIC:
If avoided decision has been mentioned 2+ times with no movement:
→ Call send_reminder for 1 week out
→ Note in session that reminder was set
```

---

## Career Intelligence Module

### 1. Positioning Playbook
- **Interactive Strategy Anchor**: A digital implementation of "The Ultimate Power of Positioning."
- **Phase Navigation**: Step-by-step roadmap from "Foundation" to "Sniper Conversion."
- **Data Logging**: Acts as a central data source for strategic alignment.

### 2. Chameleon Engine (Resume Builder)
- **Narrative Switcher**: Dynamically rewrites resume metrics for specific target cultures.
- **Archetypes**:
  - ⚡️ **Speed (xAI)**: Friction removal & velocity
  - 🛡️ **Safety (Anthropic)**: Governance & reliability
  - 🧠 **Creative (DeepMind)**: Innovation & prototyping
  - 🌐 **Ecosystem (Nvidia)**: Network effects & scale
- **LLM Integration**: Uses `claude-3-5-sonnet` to perform context-aware metric pivots.

### 3. Skill Graph Navigator
- **GNN-Style Mapping**: Visualizes skills as nodes with "gravity" (demand) and "velocity" (growth).
- **Gap Analysis**: Identifies missing skills for target roles.
- **Bridge Building**: Suggests adjacent skills to bridge gaps efficiently.

---

## Conversation Flows

### Flow: Quick Audit (15 minutes)

```yaml
name: quick_audit
duration: 15 minutes
steps:
  - id: context_check
    prompt: "Any sensitive details you'd prefer to abstract?"
    wait: true
    
  - id: role
    prompt: "What do you do? Role and context in 2 sentences."
    wait: true
    validate: must_be_specific
    
  - id: problems
    prompt: "Name 3 problems you're paid to solve—not tasks, but problems where your judgment matters."
    wait: true
    validate: must_have_three
    
  - id: direction_loop
    for_each: problems
    substeps:
      - prompt: "For {{problem}}: Is AI making this faster/cheaper?"
        wait: true
      - prompt: "Is the cost of getting it wrong rising or falling?"
        wait: true
      - prompt: "Does it require trust/judgment/context that doesn't transfer?"
        wait: true
      - action: output_direction_table
        
  - id: avoided_decision
    prompt: "What decision have you been avoiding? Not 'I could do more'—a specific conversation, risk, or conflict."
    wait: true
    validate: must_be_specific
    followup: "Why are you avoiding it?"
    
  - id: comfort_work
    prompt: "What have you spent time on that felt productive but let you avoid something harder?"
    wait: true
    validate: not_just_busywork
    
  - id: output
    action: generate_audit_summary
    format:
      - honest_assessment (2 sentences)
      - avoided_decision_with_cost
      - 90_day_prediction
      - falsification_criteria
```

### Flow: Setup (Full Portfolio)

```yaml
name: setup
steps:
  - id: intro
    prompt: "Any sensitive details to abstract?"
    wait: true
    
  - id: problem_loop
    repeat: 3-5 times
    gate: all_fields_complete
    substeps:
      - prompt: "What's a recurring problem where your judgment determines outcomes?"
        wait: true
        validate: must_be_problem_not_task
        
      - prompt: "What breaks if {{problem}} isn't solved well?"
        wait: true
        
      - prompt: |
          Which scarcity signals apply? Pick 2:
          - People escalate this to me when it's high-stakes
          - Others can do it, but I'm faster/more trusted
          - I'm the only one who can do it reliably
          - Unknown (explain why)
        wait: true
        
      - id: direction_questions
        # Same as quick audit
        
  - id: gate_check
    condition: problems.length >= 3 AND all_fields_complete
    if_false: "We need at least 3 complete problems. {{missing}}"
    
  - id: board_roles
    prompt: |
      Based on your portfolio, I'll create 5 board roles.
      Each is anchored to a specific problem with a specific question.
    action: generate_board_roles
    require_confirmation: true
    
  - id: output
    action: save_portfolio
    format: portfolio_and_roles
```

### Flow: Quarterly Review

```yaml
name: quarterly
prereq: portfolio_exists
steps:
  - id: load_context
    action: load_portfolio_and_roles
    action: load_last_bet
    action: process_uploaded_documents
    
  - id: last_bet
    prompt: "Last quarter you predicted: '{{bet.prediction}}'. You said you'd be wrong if '{{bet.wrongIf}}'. What happened?"
    wait: true
    validate: needs_evidence
    action: update_bet_status
    
  - id: commitments
    prompt: "What did you actually do this quarter? Receipts only—decisions made, artifacts shipped, outcomes achieved."
    wait: true
    validate: receipt_format
    action: log_receipts
    
  - id: avoided_decision
    prompt: "What decision did you avoid this quarter? Specific conversation, risk, or conflict."
    wait: true
    validate: must_be_specific
    followup: "What's the cost of continuing to avoid it?"
    
  - id: comfort_work
    prompt: "What did you spend time on that felt productive but let you avoid risk?"
    wait: true
    validate: not_just_busywork
    if_invalid: "Meetings and email don't count. What harder thing were you avoiding?"
    
  - id: portfolio_check
    for_each: problems
    prompt: "Is '{{problem.classification}}' still accurate for {{problem.name}}? Any shifts?"
    wait: true
    action: update_direction_if_changed
    
  - id: board_role_questions
    for_each: boardRoles
    prompt: "{{role.question}}"
    wait: true
    
  - id: next_bet
    prompt: "What's your prediction for next quarter? Must be specific and verifiable in 90 days."
    wait: true
    followup: "What evidence would prove that prediction wrong?"
    validate: has_falsification
    action: save_bet
    
  - id: output
    action: generate_quarterly_report
    format: quarterly_report
```

---

## UI Components

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  CAREER BOARD                                    [Weekly Pulse] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PORTFOLIO HEALTH                              ACTIVE BET       │
│  ┌─────────────────────────────────┐  ┌────────────────────────┐│
│  │ ▲ Coordination (Appreciating)   │  │ "I'll have the scope   ││
│  │ ▼ Analysis (Depreciating)       │  │  conversation by Feb"  ││
│  │ ─ Strategy (Stable)             │  │                        ││
│  │                                 │  │ Wrong if: No meeting   ││
│  │ Risk: 30% time on depreciating  │  │ scheduled by Jan 31    ││
│  └─────────────────────────────────┘  └────────────────────────┘│
│                                                                 │
│  AVOIDED DECISION                              RECEIPTS (Q1)    │
│  ┌─────────────────────────────────┐  ┌────────────────────────┐│
│  │ Timeline conversation with PM   │  │ ✓ Shipped: Q4 deck     ││
│  │ Why: Fear of scope creep        │  │ ✓ Decision: Vendor     ││
│  │ Cost: Team stays blocked        │  │ △ Calendar: 3 syncs    ││
│  │                      [Resolve →]│  │ ○ Proxy: NPS +5        ││
│  └─────────────────────────────────┘  └────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 💬 Start Session                                            ││
│  │                                                             ││
│  │ [Quick Audit]  [Setup Portfolio]  [Quarterly Review]        ││
│  │                                                             ││
│  │ [Upload Documents]                                          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Chat Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  QUARTERLY REVIEW — Q1 2025                           [Export]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ BOARD ──────────────────────────────────────────────────┐  │
│  │ Last quarter you predicted: "I'll shift 20% of my time   │  │
│  │ from model-building to stakeholder translation."         │  │
│  │                                                          │  │
│  │ You said you'd be wrong if your calendar still showed    │  │
│  │ 30%+ on analysis tasks.                                  │  │
│  │                                                          │  │
│  │ What happened? Show me the evidence.                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ YOU ────────────────────────────────────────────────────┐  │
│  │ I made some progress. Did more stakeholder meetings.     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ BOARD ──────────────────────────────────────────────────┐  │
│  │ "Some progress" isn't a receipt. Give me specifics:      │  │
│  │                                                          │  │
│  │ 1. How many stakeholder meetings? With whom?             │  │
│  │ 2. What decisions came from those meetings?              │  │
│  │ 3. What does your calendar actually show for analysis    │  │
│  │    time this quarter?                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Type your response...                          [Send →]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [📎 Upload Evidence]  [📅 Check Calendar]  [🔍 Search Docs]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Priorities

### Phase 1: Core (MVP)
- [ ] Data models and local JSON storage
- [ ] Chat interface with Claude API integration
- [ ] Setup flow (portfolio + board roles)
- [ ] Quick audit flow
- [ ] Basic quarterly review flow
- [ ] Export reports as markdown

### Phase 2: Automation
- [ ] Weekly pulse scheduler (cron)
- [ ] Email/notification integration
- [ ] Bet tracking with reminders
- [ ] Avoided decision follow-ups

### Phase 3: Augmentation
- [ ] Document upload and processing
- [ ] Receipt extraction from documents
- [ ] Calendar integration (read-only)
- [ ] Evidence linking

### Phase 4: Agentic
- [ ] Tool definitions and handlers
- [ ] Calendar verification
- [ ] Artifact search (Drive, GitHub, Notion)
- [ ] Automatic receipt logging
- [ ] Drift detection and flagging

---

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514  # or claude-opus-4-5-20251101

# Optional: Integrations
GOOGLE_CALENDAR_CREDENTIALS=...
GOOGLE_DRIVE_CREDENTIALS=...
NOTION_API_KEY=...
GITHUB_TOKEN=...

# Optional: Notifications
SENDGRID_API_KEY=...
NOTIFICATION_EMAIL=...

# Scheduling
WEEKLY_PULSE_CRON="0 9 * * 1"  # Mondays at 9am
TIMEZONE=America/New_York
```

### User Preferences

```json
{
  "weeklyPulse": {
    "enabled": true,
    "day": "monday",
    "time": "09:00",
    "notification": "email"
  },
  "reminders": {
    "avoidedDecision": {
      "frequency": "weekly",
      "escalateAfter": 3
    },
    "betDeadline": {
      "warnDaysBefore": 14
    }
  },
  "integrations": {
    "calendar": "google",
    "documents": ["drive", "notion"],
    "code": "github"
  }
}
```

---

## Prompt Engineering Notes

### The 4 D's

**Delegation:** The system delegates accountability back to the user through:
- Board roles that ask specific, anchored questions
- Receipt requirements that demand evidence
- Bets that force falsifiable predictions

**Description:** Every element requires specific description:
- Problems must describe what breaks
- Directions must quote user's own words
- Receipts must be typed and sourced

**Discernment:** The AI exercises discernment through:
- Validation gates that reject vague answers
- Direction classification logic
- Comfort work detection (not just busywork)

**Diligence:** The system enforces diligence through:
- Weekly pulse checks
- Quarterly full reviews
- Bet tracking with falsification criteria
- Avoided decision follow-ups

### Anti-Patterns to Prevent

```markdown
NEVER ACCEPT:
- "I've been busy" → Ask: "Busy doing what? Name one artifact."
- "Things are progressing" → Ask: "What specific decision was made?"
- "I think it's going well" → Ask: "What evidence supports that?"
- "Email and meetings" as comfort work → Ask: "What harder thing did that let you avoid?"
- Vague predictions → Require: "What would prove this wrong?"

ALWAYS DEMAND:
- Specific names, dates, outcomes
- Evidence that exists outside the conversation
- Falsification criteria for predictions
- Concrete examples before accepting classifications
```

---

## Testing Scenarios

### Scenario 1: New User Setup
```
Input: User has never used the system
Expected: Complete Setup flow, output Portfolio + Board Roles
Validate: 3-5 problems, all fields filled, roles anchored to specific problems
```

### Scenario 2: Vague Responder
```
Input: User gives vague answers ("it's going okay", "some progress")
Expected: AI pushes back, asks for specifics, doesn't proceed until concrete
Validate: No vague answers accepted in final output
```

### Scenario 3: Quarterly with Documents
```
Input: User uploads calendar export + project doc
Expected: AI extracts potential receipts, asks for confirmation, links to problems
Validate: Receipts properly typed and attributed
```

### Scenario 4: Drift Detection
```
Input: User's responses show increased time on "depreciating" problem
Expected: AI flags drift, Market Reality role challenges
Validate: Flag created with specific observation
```

### Scenario 5: Avoided Decision Follow-up
```
Input: Same avoided decision mentioned 3 weeks in a row
Expected: AI notes pattern, schedules escalating reminder
Validate: Reminder scheduled, pattern acknowledged
```

---

## License

MIT

---

## Contributing

This system is designed to be forked and customized. The core flows are intentionally rigid to prevent drift, but the integrations and UI can be adapted to your workflow.

Key customization points:
- `lib/ai/prompts.ts` — Adjust tone and question style
- `lib/ai/tools.ts` — Add integrations for your tools
- `lib/scheduler/cron.ts` — Change pulse frequency
- `data/` — Swap JSON for your preferred storage
# Last updated: 2026-01-06 10:53:17 UTC
