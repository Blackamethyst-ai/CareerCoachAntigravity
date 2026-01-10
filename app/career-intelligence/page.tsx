'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Zap,
    Network,
    Target,
    BarChart3,
    Brain,
    TrendingUp,
    Sparkles,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    GitBranch,
    Activity,
    Linkedin,
    MessageSquare,
    Book,
} from 'lucide-react';
import SkillGraphCanvas from './components/SkillGraphCanvas';
import PlaybookViewer from './components/PlaybookViewer';
import './skill-graph.css';

// Types
interface SkillNode {
    id: string;
    name: string;
    category: string;
    demandScore: number;
    growthRate: number;
}

interface SignalAnalysis {
    overallScore: number;
    criticalGaps: string[];
    optimizations: Array<{
        area: string;
        priority: string;
        action: string;
        impact: string;
        effort: string;
    }>;
    estimatedGNNReach: number;
}

interface SkillCoverage {
    directMatches: string[];
    adjacentMatches: Array<{ required: string; candidate: string; distance: number }>;
    gaps: string[];
    coverageScore: number;
}

// Paper benchmarks
const PAPER_INSIGHTS = {
    stanford: {
        title: 'Stanford/micro1',
        insights: [
            { metric: '54% vs 34%', description: 'AI pipeline pass rate vs traditional' },
            { metric: '2 SD', description: 'Higher conversational quality importance' },
            { metric: '21%', description: 'Skill misrepresentation detection rate' },
        ],
    },
    linkedin: {
        title: 'LinkedIn STAR',
        insights: [
            { metric: 'E5-Mistral-7B', description: 'LLM for profile embedding (1800 tokens)' },
            { metric: '100 neighbors', description: 'GNN samples in neighbor aggregation' },
            { metric: '+1.5%', description: 'Site-wide job applications increase' },
        ],
    },
};

export default function CareerIntelligencePage() {
    const [profileText, setProfileText] = useState('');
    const [targetSkills, setTargetSkills] = useState('react, typescript, aws');
    const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'skill-graph' | 'linkedin' | 'combo' | 'playbook'>('skill-graph');

    // Results
    const [skillCoverage, setSkillCoverage] = useState<SkillCoverage | null>(null);
    const [linkedInSignals, setLinkedInSignals] = useState<SignalAnalysis | null>(null);
    const [availableSkills, setAvailableSkills] = useState<SkillNode[]>([]);

    // Load skills and profile on mount
    useEffect(() => {
        async function loadData() {
            // Load available skills
            try {
                const skillsRes = await fetch('/api/career-intelligence/skill-graph');
                const skillsData = await skillsRes.json();
                if (skillsData.skills) {
                    setAvailableSkills(skillsData.skills);
                }
            } catch (err) {
                console.log('Could not load skills:', err);
            }

            // Load default profile
            try {
                const profileRes = await fetch('/CareerResumeBuilder/dico-angelo-master-profile-v3-final.md');
                if (profileRes.ok) {
                    const text = await profileRes.text();
                    setProfileText(text);
                    // Extract skills from profile for defaults
                    const defaultSkills = ['salesforce', 'partner-operations', 'python', 'react'];
                    setCandidateSkills(defaultSkills);
                }
            } catch (err) {
                console.log('Could not load profile:', err);
            }
        }
        loadData();
    }, []);

    const analyzeSkillGraph = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/career-intelligence/skill-graph', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'coverage',
                    skills: candidateSkills,
                    targetSkills: targetSkills.split(',').map(s => s.trim()),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSkillCoverage(data.coverage);
            }
        } catch (err) {
            console.error('Skill graph error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeLinkedIn = async () => {
        if (!profileText) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/career-intelligence/linkedin-signals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze-signals',
                    profileText,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setLinkedInSignals(data.analysis);
            }
        } catch (err) {
            console.error('LinkedIn analysis error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSkill = (skill: string) => {
        if (candidateSkills.includes(skill)) {
            setCandidateSkills(prev => prev.filter(s => s !== skill));
        } else {
            setCandidateSkills(prev => [...prev, skill]);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400 bg-red-500/20';
            case 'high': return 'text-amber-400 bg-amber-500/20';
            case 'medium': return 'text-blue-400 bg-blue-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-[#0a0a0f]/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Dashboard</span>
                        </Link>
                        <div className="w-px h-6 bg-gray-800" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Career Intelligence</h1>
                                <p className="text-xs text-gray-500">Combo Systems • Stanford × LinkedIn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Paper Insights Banner */}
            <div className="relative z-10 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(PAPER_INSIGHTS).map(([key, paper]) => (
                            <div key={key} className="p-4 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/50 border border-gray-700/50">
                                <div className="text-sm font-semibold text-white mb-2">{paper.title}</div>
                                <div className="flex gap-4">
                                    {paper.insights.map((insight, i) => (
                                        <div key={i} className="flex-1">
                                            <div className={`text-lg font-bold ${key === 'stanford' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                {insight.metric}
                                            </div>
                                            <div className="text-xs text-gray-500">{insight.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('skill-graph')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'skill-graph'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <GitBranch className="w-4 h-4" />
                        Skill Graph
                    </button>
                    <button
                        onClick={() => setActiveTab('linkedin')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'linkedin'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Signals
                    </button>
                    <button
                        onClick={() => setActiveTab('combo')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'combo'
                            ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        Combo Moves
                    </button>
                    <button
                        onClick={() => setActiveTab('playbook')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'playbook'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Book className="w-4 h-4" />
                        Playbook
                    </button>
                </div>

                {/* Skill Graph Tab */}
                {activeTab === 'skill-graph' && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Network className="w-5 h-5 text-purple-400" />
                                Interactive Skill Graph Navigator
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                <strong>Innovation Upgrade:</strong> Utilizing Ternary Relationships (User &harr; Position &harr; Company) from latest arXiv research.
                                Drag and drop nodes to explore career trajectories and skill adjacencies.
                            </p>

                            {/* New Interactive Canvas */}
                            <div className="mb-8">
                                <SkillGraphCanvas />
                            </div>

                            {/* Skill Selection (Adjusted for UI balance) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">My Skill Inventory</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSkills.map(skill => (
                                            <button
                                                key={skill.id}
                                                onClick={() => toggleSkill(skill.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${candidateSkills.includes(skill.id)
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                {skill.name}
                                                {skill.growthRate > 20 && (
                                                    <TrendingUp className="w-3 h-3 inline-block ml-1 text-emerald-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Trajectory</label>
                                    <input
                                        type="text"
                                        value={targetSkills}
                                        onChange={(e) => setTargetSkills(e.target.value)}
                                        placeholder="Enter goal roles or skills..."
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm mb-4"
                                    />
                                    <button
                                        onClick={analyzeSkillGraph}
                                        disabled={isLoading || candidateSkills.length === 0}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 transition-all"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Target className="w-5 h-5" />
                                                Run Alignment Engine
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Skill Coverage Results */}
                        {skillCoverage && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Coverage Score */}
                                <div className={`p-6 rounded-2xl border backdrop-blur-xl ${skillCoverage.coverageScore >= 70
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : skillCoverage.coverageScore >= 40
                                        ? 'bg-amber-500/10 border-amber-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Skill Coverage Score</h3>
                                            <p className="text-sm text-gray-400">Based on GNN neighbor sampling (2 hops)</p>
                                        </div>
                                        <div className={`text-5xl font-bold ${skillCoverage.coverageScore >= 70 ? 'text-emerald-400' :
                                            skillCoverage.coverageScore >= 40 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {skillCoverage.coverageScore.toFixed(0)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Direct Matches */}
                                {skillCoverage.directMatches.length > 0 && (
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-400 mb-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Direct Matches ({skillCoverage.directMatches.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skillCoverage.directMatches.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Adjacent Matches */}
                                {skillCoverage.adjacentMatches.length > 0 && (
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-2">
                                            <GitBranch className="w-4 h-4" />
                                            Adjacent Matches ({skillCoverage.adjacentMatches.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {skillCoverage.adjacentMatches.map((match, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                    <span className="text-purple-400">{match.candidate}</span>
                                                    <span className="text-gray-600">→</span>
                                                    <span className="text-xs text-gray-500">{match.distance} hop{match.distance > 1 ? 's' : ''}</span>
                                                    <span className="text-gray-600">→</span>
                                                    <span className="text-blue-400">{match.required}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Gaps */}
                                {skillCoverage.gaps.length > 0 && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-red-400 mb-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Skill Gaps ({skillCoverage.gaps.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skillCoverage.gaps.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            These skills are &gt;2 hops away from your current skills
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* LinkedIn Signals Tab */}
                {activeTab === 'linkedin' && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Linkedin className="w-5 h-5 text-blue-400" />
                                LinkedIn STAR Signal Analysis
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Reverse-engineered from LinkedIn&apos;s STAR paper: analyze your profile for edge types, signal strength, and GNN reach optimization.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Profile/Resume Text
                                </label>
                                <textarea
                                    value={profileText}
                                    onChange={(e) => setProfileText(e.target.value)}
                                    placeholder="Paste your LinkedIn profile or resume..."
                                    className="w-full h-40 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none font-mono text-xs"
                                />
                                <div className="text-right text-xs text-gray-600 mt-1">
                                    {profileText.length.toLocaleString()} characters
                                </div>
                            </div>

                            <button
                                onClick={analyzeLinkedIn}
                                disabled={isLoading || !profileText.trim()}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 transition-all"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Activity className="w-5 h-5" />
                                        Analyze LinkedIn Signals
                                    </>
                                )}
                            </button>
                        </div>

                        {/* LinkedIn Results */}
                        {linkedInSignals && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Overall Score */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                                        <div className={`text-4xl font-bold ${linkedInSignals.overallScore >= 60 ? 'text-emerald-400' :
                                            linkedInSignals.overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {linkedInSignals.overallScore.toFixed(0)}%
                                        </div>
                                        <div className="text-sm text-gray-400">Signal Strength</div>
                                    </div>
                                    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                                        <div className="text-4xl font-bold text-blue-400">
                                            {(linkedInSignals.estimatedGNNReach / 1000).toFixed(0)}K
                                        </div>
                                        <div className="text-sm text-gray-400">Est. GNN Reach (jobs)</div>
                                    </div>
                                </div>

                                {/* Critical Gaps */}
                                {linkedInSignals.criticalGaps.length > 0 && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <h4 className="text-sm font-medium text-red-400 mb-2">Critical Gaps</h4>
                                        <ul className="space-y-1">
                                            {linkedInSignals.criticalGaps.map((gap, i) => (
                                                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                    {gap}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Optimizations */}
                                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                                    <h4 className="text-lg font-semibold text-white mb-4">STAR Optimizations</h4>
                                    <div className="space-y-3">
                                        {linkedInSignals.optimizations.map((opt, i) => (
                                            <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-white">{opt.area}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(opt.priority)}`}>
                                                        {opt.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300 mb-2">{opt.action}</p>
                                                <p className="text-xs text-gray-500">{opt.impact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Playbook Tab */}
                {activeTab === 'playbook' && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Book className="w-5 h-5 text-emerald-400" />
                                The Ultimate Power of Positioning Playbook
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                A repeatable framework for generating simultaneous job offers by orchestrating Mastery, Clarity, and Volume.
                            </p>
                            <PlaybookViewer />
                        </div>
                    </div>
                )}

                {/* Combo Moves Tab */}
                {activeTab === 'combo' && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-orange-900/30 border border-purple-500/30 backdrop-blur-xl">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Sparkles className="w-5 h-5 text-orange-400" />
                                SUPER COMBO: Stanford × LinkedIn Fusion
                            </h2>
                            <p className="text-gray-400 text-sm">
                                These moves combine insights from both papers for maximum impact.
                            </p>
                        </div>

                        {/* Combo Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/interview-prep" className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <Brain className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Interview Prep</h3>
                                        <p className="text-xs text-emerald-400">Stanford Paper Based</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Skill depth analysis + AI interview simulation with conversational scoring
                                </p>
                                <div className="flex items-center gap-1 text-emerald-400 text-sm group-hover:gap-2 transition-all">
                                    Launch <ChevronRight className="w-4 h-4" />
                                </div>
                            </Link>

                            <Link href="/resume-builder" className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Resume Builder</h3>
                                        <p className="text-xs text-blue-400">Keyword Matching</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Profile-to-job matching with keyword and experience analysis
                                </p>
                                <div className="flex items-center gap-1 text-blue-400 text-sm group-hover:gap-2 transition-all">
                                    Launch <ChevronRight className="w-4 h-4" />
                                </div>
                            </Link>

                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 border-dashed">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Response Embeddings</h3>
                                        <p className="text-xs text-purple-400">SUPER COMBO</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Compare your responses to ideal answer embeddings using bi-encoder approach
                                </p>
                                <div className="text-xs text-gray-500">Coming in Interview Prep v2</div>
                            </div>

                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 border-dashed">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Bi-Encoder Match</h3>
                                        <p className="text-xs text-orange-400">ULTIMATE COMBO</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    Profile embedding × Job embedding = semantic match score (STAR architecture)
                                </p>
                                <div className="text-xs text-gray-500">Coming soon</div>
                            </div>
                        </div>

                        {/* Strategic Insight */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/50 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">💡 The Meta-Insight</h3>
                            <div className="space-y-3 text-sm text-gray-300">
                                <p>
                                    <strong className="text-purple-400">LinkedIn</strong> and <strong className="text-emerald-400">AI Recruiters</strong> are solving the SAME problem:
                                </p>
                                <p className="pl-4 border-l-2 border-purple-500 italic">
                                    &quot;Match candidates to jobs using embeddings&quot;
                                </p>
                                <p>
                                    <strong>The difference:</strong>
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>LinkedIn: Optimize for applications, clicks, engagement</li>
                                    <li>AI Recruiter: Optimize for actual hire quality</li>
                                </ul>
                                <p className="text-white font-medium mt-4">
                                    Your advantage: Optimize for <span className="text-purple-400">BOTH</span>. Build a profile that embeds well AND an interview presence that demonstrates depth.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
