---
description: Scour arXiv and GitHub for cutting-edge innovations relevant to our project.
---

1. **Multimodal Search Strategy**: Launch `browser_subagent` with two distinct filters:
    - **The Viral Filter**: Search GitHub for `stars:>500` and `pushed:>[current_date - 30 days]`. Focus on rapid adoption and community-vetted UI patterns.
    - **The Groundbreaker Filter**: Search arXiv and GitHub for low-star/high-relevance results (e.g., `stars:10..100`). Focus on novel math, unique GNN architectures, or biometric implementations that are too new for mainstream adoption.
2. **Tab History Logging**: 
    - The sub-agent MUST record every single URL visited into `.agent/research/[topic]_session_log.md`.
    - This file will act as a "Session History" for that specific research mission, allowing the user to revisit any tab later.
3. **Direct Extraction & Checkpoints**:
    - Navigate directly to `/html/` (arXiv) or `/tree/main/docs` (GitHub) to save time.
    - Save incremental findings to `.agent/research/scratchpad.json` to prevent data loss.
4. **Synthesis & Archiving**:
    - Create `.agent/research/[topic]_innovation_report.md`.
    - **CRITICAL REQUIREMENT**: Every feature recommendation must include a direct markdown link to the source (arXiv/GitHub) in parentheses.
    - Structure the report using:
        - **The Viral Choice**: High-adoption, community-proven features (link to high-star repo).
        - **The Groundbreaker Choice**: Novel, experimental features (link to arXiv or low-star repo).
    - Create a accompanying `sources.csv` for raw data reference.
5. **Clean Up**: Once the report is written, use the `/session-archiver` to log history and close research tabs.
