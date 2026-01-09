# Innovation Scout: AI Career Intelligence Review (2025)

## Summary of Findings
The latest research (2024-2025) indicates a transition from static "Skill Lists" to **Dynamic Temporal Multi-layer Graphs**. Career trajectories are now being modeled as living ecosystems rather than snapshots.

### 1. CAPER: The Ternary Ecosystem
- **Concept**: Moves beyond (A $\to$ B) job transitions. It models the **User**, the **Position**, and the **Company** as a three-way relationship.
- **Architectural Shift**: Use **Temporal Knowledge Graphs (TKG)**. Instead of one graph, store a sequence of graph snapshots across time.
- **Next-Step Prediction**: Uses GCN (Graph Convolutional Networks) to understand how the *nature* of a company influences the *value* of a position for a specific user.

### 2. CareerScape: Graph-Based Integrity
- **Concept**: Uses a "Global Reference Graph" to validate individual resumes.
- **Multi-layer Support**: 
    - **Title Layer**: Logical promotions.
    - **Company Layer**: Industry movement patterns.
    - **Description Layer**: Semantic similarity (BERT-based).
- **Application**: We can use this to "Score" how realistic or optimal a career path is by comparing it to millions of global patterns.

### 3. TraceTop: The Skill Tech-Tree
- **Concept**: Personal growth is a "Tech Tree" (Gamification).
- **Automation**: Uses LLMs to turn messy logs (GitHub, notes) into structured vector milestones.
- **UI Tip**: Use a "Lighting" system where mastered nodes illuminate the neighboring paths (the "Fog of War" approach to career planning).

## Implementation Roadmap for CareerCoachAntigravity

### Phase 1: Data Model Upgrade
- [ ] Implement `TernaryEdge` structure: `(UserID) -[TransitionAt:{timestamp}]-> (PositionID) -[OfferedBy]-> (CompanyID)`.
- [ ] Integrate **JobBERT** embeddings for job description similarity scoring.

### Phase 2: Visualization
- [ ] Switch to **React Flow (XYFlow)** for the "Tech-Tree" interactive view.
- [ ] Implement a "Time Slider" to see how the user's skill graph has expanded year-over-year.

### Phase 3: AI Intelligence
- [ ] Add a "Signature Anomaly" check (CareerScape logic) to help users identify weak links in their resume's logical progression.
- [ ] Deploy a TKG-based "Next Optimal Skill" recommender.
