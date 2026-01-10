import { useCareerBoardStore } from './store';
import { parseProfile } from './resume-builder/profile-parser';
import { analyzeSkillPortfolio } from './career-intelligence/skill-graph';
import { MasterProfile } from './resume-builder/types';

/**
 * NEXUS ENGINE
 * The "Invention Layer" that weaves disjointed data into crystallized gems.
 */

export const nexus = {
    /**
     * Ingests a new Master Profile and weaves it through the entire system.
     * Updates the global store with "crystallized" insights.
     */
    ingestProfile: (profileText: string) => {
        const store = useCareerBoardStore.getState();
        store.setMasterProfile(profileText);
        store.updateNexusState({ status: 'weaving' });

        // 1. Parse Structure
        const profile = parseProfile(profileText);

        // 2. Weave Skill Graph
        const skillAnalysis = analyzeSkillPortfolio(profile.skills);

        // 3. Weave Strategic Positioning
        // Find which Phase of the playbook the user is likely in
        const currentPhase = determinePlaybookPhase(profile);

        // 4. Crystallize
        store.updateNexusState({
            status: 'crystallized',
            gaps: skillAnalysis.suggestions,
            strategicMoves: [currentPhase],
            matches: [] // to be filled by job ingestion
        });

        return {
            profile,
            analysis: skillAnalysis,
            strategy: currentPhase
        };
    },

    /**
     * Ingests a Job Description and immediately generates a "Convergence Play".
     */
    ingestTarget: (jobText: string) => {
        // Placeholder for future implementation
        // This is where we'd call the LLM to 'crystallize' a tailored resume
        console.log(`Ingesting job description: ${jobText.substring(0, 50)}...`);
        return {
            // Placeholder for the "Gem" - the perfect tailored resume
            tailoredResume: "Generated...",
            gapClosingPlan: []
        };
    }
};

// Helper: Simple heuristic to guess where user is in the playbook
function determinePlaybookPhase(profile: MasterProfile): string {
    if (profile.skills.length < 5) return "Phase 1: The Foundation";
    if (!profile.chameleonValues) return "Phase 4: The Pivot (Needs Archetype)";
    return "Phase 5: Sniper Conversion";
}
