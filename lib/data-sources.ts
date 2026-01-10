export interface DataSource {
    id: string;
    title: string;
    type: 'paper' | 'playbook' | 'article';
    description: string;
    key_insights: string[];
    date?: string;
    author?: string;
}

export const DATA_SOURCES: DataSource[] = [
    {
        id: 'stanford-micro1',
        title: 'Stanford/micro1 Research',
        type: 'paper',
        description: 'Analysis of AI pipeline pass rates vs traditional methods.',
        key_insights: [
            '54% vs 34% AI pipeline pass rate vs traditional',
            'Higher conversational quality importance (2 SD)',
            '21% skill misrepresentation detection rate'
        ]
    },
    {
        id: 'linkedin-star',
        title: 'LinkedIn STAR Framework',
        type: 'paper',
        description: 'Skill-Term Acknowledge & Ranking framework using embeddings and GNNs.',
        key_insights: [
            'E5-Mistral-7B for profile embedding',
            '100 neighbors in GNN aggregation',
            '+1.5% site-wide job applications increase'
        ]
    },
    {
        id: 'positioning-playbook',
        title: 'The Ultimate Power of Positioning Playbook',
        type: 'playbook',
        description: 'Strategic framework for generating simultaneous job offers through mastery, clarity, and volume.',
        author: 'Dico Angelo',
        date: '2025-01-10',
        key_insights: [
            'The Foundation: Building the Master Asset',
            'One-to-Many Architecture: Modular Resume Strategy',
            'Fast Application Sprint: High-Volume Execution',
            'The Pivot: Contextual Positioning for different cultures',
            'Sniper Conversion: Interview tactics'
        ]
    }
];
