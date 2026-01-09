# Agentic Context & MCP Architecture

## 🤖 For AI Agents
This directory serves as the **cognitive control center** for the Career Coach Antigravity project. If you are an LLM or an Agent operating on this codebase, **READ THIS FIRST**.

### 1. Project Topology
*   **Root**: Next.js 14 (App Router) + TypeScript + Tailwind.
*   **State Management**: Zustand stores are located in `app/lib/store`.
*   **AI Logic**: All prompts, tools, and workflows are in `app/lib/ai`.

### 2. Available Workflows
You can execute the following workflows by reading the corresponding markdown files in `.agent/workflows/`:
*   `/deep-research`: Research a topic thoroughly.
*   `/innovation-scout`: Find new GitHub/arXiv trends.
*   `/remember`: Save long-term memory to `memory.md`.

### 3. Tool Definitions (MCP)
This project adheres to the **Model Context Protocol**.
*   **Browser Subagent**: Used for external research.
*   **File System**: Standard access restricted to `CareerCoachAntigravity`.

### 4. Dynamic State
*   **Latest Innovation**: [See subagent_logs.md](./subagent_logs.md) for the most recent research trajectories.
*   **Memory**: [See memory.md](./memory.md) for project-specific facts.

---
**Human Note**: This file is maintained to ensure that any AI agent dropping into this project has immediate, hallucination-free context.
