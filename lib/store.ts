import { create } from 'zustand';

interface Problem {
    id: string;
    name: string;
    whatBreaks: string;
    classification: 'appreciating' | 'depreciating' | 'stable' | 'stable_uncertain';
}

interface Bet {
    id: string;
    quarter: string;
    prediction: string;
    wrongIf: string;
    result?: 'happened' | 'didnt' | 'partial';
}

interface Receipt {
    id: string;
    type: 'decision' | 'artifact' | 'calendar' | 'proxy';
    strength: 'strong' | 'medium' | 'weak';
    description: string;
    date: string;
}

interface AvoidedDecision {
    id: string;
    what: string;
    whyAvoiding: string;
    cost: string;
    weeksStalled: number;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface CareerBoardState {
    // Data
    problems: Problem[];
    activeBet: Bet | null;
    receipts: Receipt[];
    avoidedDecisions: AvoidedDecision[];
    messages: Message[];

    // Nexus Engine (The Invention Layer)
    masterProfile: string | null;
    nexusState: {
        matches: any[];
        gaps: string[];
        strategicMoves: string[];
        status: 'idle' | 'weaving' | 'crystallized';
    };

    // UI State
    isChatOpen: boolean;
    currentSession: 'quick_audit' | 'setup' | 'quarterly' | 'weekly' | null;
    isLoading: boolean;


    // Actions
    setProblems: (problems: Problem[]) => void;
    setActiveBet: (bet: Bet | null) => void;
    addReceipt: (receipt: Receipt) => void;
    setAvoidedDecisions: (decisions: AvoidedDecision[]) => void;
    toggleChat: () => void;
    startSession: (type: CareerBoardState['currentSession']) => void;
    endSession: () => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    clearMessages: () => void;
    setLoading: (loading: boolean) => void;

    // Nexus Actions
    setMasterProfile: (text: string) => void;
    updateNexusState: (partial: Partial<CareerBoardState['nexusState']>) => void;
}

export const useCareerBoardStore = create<CareerBoardState>((set) => ({
    // Initial data - demo/placeholder content
    problems: [
        {
            id: 'problem_001',
            name: 'Cross-Team Coordination',
            whatBreaks: 'Projects stall, stakeholders misaligned, deadlines slip',
            classification: 'appreciating',
        },
        {
            id: 'problem_002',
            name: 'Technical Analysis',
            whatBreaks: 'Wrong decisions, wasted resources, poor outcomes',
            classification: 'depreciating',
        },
        {
            id: 'problem_003',
            name: 'Strategic Planning',
            whatBreaks: 'Team lacks direction, opportunities missed',
            classification: 'stable',
        },
    ],

    activeBet: {
        id: 'bet_001',
        quarter: 'Q1 2025',
        prediction: "I'll have the scope conversation with leadership by end of quarter",
        wrongIf: 'No meeting scheduled by March 15',
    },

    receipts: [
        {
            id: 'receipt_001',
            type: 'artifact',
            strength: 'strong',
            description: 'Q4 Strategy Deck shipped',
            date: new Date().toISOString(),
        },
        {
            id: 'receipt_002',
            type: 'decision',
            strength: 'strong',
            description: 'Approved vendor selection',
            date: new Date().toISOString(),
        },
        {
            id: 'receipt_003',
            type: 'calendar',
            strength: 'weak',
            description: '3 stakeholder syncs',
            date: new Date().toISOString(),
        },
    ],

    avoidedDecisions: [
        {
            id: 'avoid_001',
            what: 'Timeline conversation with PM',
            whyAvoiding: 'Fear of scope creep pushback',
            cost: 'Team stays blocked on unclear priorities',
            weeksStalled: 3,
        },
    ],

    messages: [],

    // UI State
    isChatOpen: false,
    currentSession: null,
    isLoading: false,

    // Actions
    setProblems: (problems) => set({ problems }),
    setActiveBet: (activeBet) => set({ activeBet }),
    addReceipt: (receipt) => set((state) => ({
        receipts: [...state.receipts, receipt]
    })),
    setAvoidedDecisions: (avoidedDecisions) => set({ avoidedDecisions }),
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    startSession: (currentSession) => set({ currentSession, isChatOpen: true }),
    endSession: () => set({ currentSession: null, isChatOpen: false }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
            ...message,
            id: `msg_${Date.now()}`,
            timestamp: new Date().toISOString(),
        }],
    })),
    clearMessages: () => set({ messages: [] }),
    setLoading: (isLoading) => set({ isLoading }),

    // Nexus Actions
    masterProfile: null,
    nexusState: {
        matches: [],
        gaps: [],
        strategicMoves: [],
        status: 'idle'
    },
    setMasterProfile: (text) => set({ masterProfile: text }),
    updateNexusState: (partial) => set((state) => ({
        nexusState: { ...state.nexusState, ...partial }
    })),
}));
