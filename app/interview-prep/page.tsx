'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Brain,
    Target,
    Zap,
    BarChart3,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Play,
    BookOpen,
    Sparkles,
    Activity,
} from 'lucide-react';

interface SkillAssessment {
    skillName: string;
    claimedLevel: string;
    evidenceStrength: number;
    predictedAIRating: string;
    confidence: number;
    gaps: string[];
    recommendations: string[];
    narrativeDepth: {
        projectCount: number;
        specificityScore: number;
        recencyScore: number;
        teachingEvidence: boolean;
        architecturalDecisions: boolean;
        quantifiedImpact: boolean;
    };
}

interface AnalysisResponse {
    success: boolean;
    assessments: SkillAssessment[];
    summary: {
        totalSkillsFound: number;
        averageEvidenceStrength: number;
        skillsWithGaps: number;
        readyForAI: number;
    };
    prioritySkills: Array<{
        skill: string;
        evidenceStrength: number;
        predictedRating: string;
        topRecommendation: string;
    }>;
    overallPrediction?: {
        total: number;
        perSkill: Record<string, { rating: string; score: number }>;
        passLikelihood: number;
    };
}

// Paper benchmarks
const BENCHMARKS = {
    TRADITIONAL_PASS_RATE: 34,
    AI_PIPELINE_PASS_RATE: 54,
    AI_CONVERSATIONAL: 7.8,
    HUMAN_CONVERSATIONAL: 5.4,
};

export default function InterviewPrepPage() {
    const [profileText, setProfileText] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('react, javascript, css');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

    // Load default profile on mount
    useEffect(() => {
        async function loadDefaultProfile() {
            try {
                const response = await fetch('/CareerResumeBuilder/dico-angelo-master-profile-v3-final.md');
                if (response.ok) {
                    const text = await response.text();
                    setProfileText(text);
                }
            } catch (err) {
                console.log('Could not load default profile:', err);
            } finally {
                setIsLoadingProfile(false);
            }
        }
        loadDefaultProfile();
    }, []);

    const handleAnalyze = async () => {
        if (!profileText.trim()) {
            setError('Please provide your profile text');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/interview-prep/analyze-depth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileText,
                    requiredSkills: requiredSkills.split(',').map(s => s.trim()),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'senior': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
            case 'mid-level': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'junior': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            default: return 'text-red-400 bg-red-500/20 border-red-500/30';
        }
    };

    const getStrengthColor = (strength: number) => {
        if (strength >= 75) return 'bg-emerald-500';
        if (strength >= 50) return 'bg-blue-500';
        if (strength >= 25) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Interview Prep</h1>
                                <p className="text-xs text-gray-500">AI Interview Readiness System</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/interview-prep/simulator" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors">
                            <Play className="w-4 h-4" />
                            Simulator
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Benchmark Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                        <div className="text-2xl font-bold text-emerald-400">{BENCHMARKS.AI_PIPELINE_PASS_RATE}%</div>
                        <div className="text-xs text-gray-500">AI Pipeline Pass Rate</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                        <div className="text-2xl font-bold text-amber-400">{BENCHMARKS.TRADITIONAL_PASS_RATE}%</div>
                        <div className="text-xs text-gray-500">Traditional Pass Rate</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                        <div className="text-2xl font-bold text-blue-400">{BENCHMARKS.AI_CONVERSATIONAL}</div>
                        <div className="text-xs text-gray-500">AI Conversational Score</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                        <div className="text-2xl font-bold text-gray-400">{BENCHMARKS.HUMAN_CONVERSATIONAL}</div>
                        <div className="text-xs text-gray-500">Human Conversational Score</div>
                    </div>
                </div>

                {!result ? (
                    /* Input Form */
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Target className="w-5 h-5 text-blue-400" />
                                Skill Depth Analysis
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Analyze your profile to predict how you&apos;d perform in an AI interview. Based on Stanford/micro1 research on AI-assisted recruitment.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={requiredSkills}
                                        onChange={(e) => setRequiredSkills(e.target.value)}
                                        placeholder="react, javascript, css"
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Master Profile {isLoadingProfile && <span className="text-gray-500">(Loading...)</span>}
                                    </label>
                                    <textarea
                                        value={profileText}
                                        onChange={(e) => setProfileText(e.target.value)}
                                        placeholder="Paste your master profile or resume..."
                                        className="w-full h-48 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none font-mono text-xs"
                                    />
                                    <div className="text-right text-xs text-gray-600 mt-1">
                                        {profileText.length.toLocaleString()} characters
                                    </div>
                                </div>

                                {error && (
                                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !profileText.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Analyze Skill Depth
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/interview-prep/simulator" className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-emerald-500/30 transition-all group">
                                <Play className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-white mb-1">AI Interview Simulator</h3>
                                <p className="text-sm text-gray-500">Practice with realistic AI interview questions</p>
                            </Link>
                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 opacity-60">
                                <MessageSquare className="w-8 h-8 text-purple-400 mb-3" />
                                <h3 className="font-semibold text-white mb-1">Conversational Trainer</h3>
                                <p className="text-sm text-gray-500">Improve dialogue quality (Coming soon)</p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 opacity-60">
                                <BarChart3 className="w-8 h-8 text-amber-400 mb-3" />
                                <h3 className="font-semibold text-white mb-1">Score Gap Analysis</h3>
                                <p className="text-sm text-gray-500">Resume vs AI score comparison (Coming soon)</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Results View */
                    <div className="space-y-6 animate-fade-in">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-3xl font-bold text-white">{result.summary.totalSkillsFound}</div>
                                <div className="text-xs text-gray-500">Skills Detected</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-3xl font-bold text-blue-400">{result.summary.averageEvidenceStrength.toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">Avg Evidence Strength</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-3xl font-bold text-emerald-400">{result.summary.readyForAI}</div>
                                <div className="text-xs text-gray-500">AI-Ready Skills</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-3xl font-bold text-amber-400">{result.summary.skillsWithGaps}</div>
                                <div className="text-xs text-gray-500">Skills with Gaps</div>
                            </div>
                        </div>

                        {/* Pass Likelihood */}
                        {result.overallPrediction && (
                            <div className={`p-6 rounded-2xl border backdrop-blur-xl ${result.overallPrediction.passLikelihood >= 70
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : result.overallPrediction.passLikelihood >= 50
                                        ? 'bg-amber-500/10 border-amber-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">Predicted Pass Likelihood</h3>
                                        <p className="text-sm text-gray-400">Based on required skills analysis</p>
                                    </div>
                                    <div className={`text-5xl font-bold ${result.overallPrediction.passLikelihood >= 70
                                            ? 'text-emerald-400'
                                            : result.overallPrediction.passLikelihood >= 50
                                                ? 'text-amber-400'
                                                : 'text-red-400'
                                        }`}>
                                        {result.overallPrediction.passLikelihood.toFixed(0)}%
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {Object.entries(result.overallPrediction.perSkill).map(([skill, data]) => (
                                        <div key={skill} className="p-3 rounded-lg bg-gray-900/50">
                                            <div className="text-sm font-medium text-gray-300 capitalize">{skill}</div>
                                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getRatingColor(data.rating)}`}>
                                                {data.rating}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Priority Skills */}
                        {result.prioritySkills.length > 0 && (
                            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xl">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                    Priority Improvements
                                </h3>
                                <div className="space-y-3">
                                    {result.prioritySkills.map((skill, idx) => (
                                        <div key={skill.skill} className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/50">
                                            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white capitalize">{skill.skill}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRatingColor(skill.predictedRating)}`}>
                                                        {skill.predictedRating}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">{skill.topRecommendation}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-300">{skill.evidenceStrength}%</div>
                                                <div className="text-xs text-gray-500">evidence</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Skills */}
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                All Skills Analysis
                            </h3>
                            <div className="space-y-2">
                                {result.assessments.map((assessment) => (
                                    <div key={assessment.skillName} className="border border-gray-800 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedSkill(expandedSkill === assessment.skillName ? null : assessment.skillName)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12">
                                                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                                        <div
                                                            className={`h-full ${getStrengthColor(assessment.evidenceStrength)} transition-all`}
                                                            style={{ width: `${assessment.evidenceStrength}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{assessment.evidenceStrength}%</div>
                                                </div>
                                                <span className="font-medium text-white capitalize">{assessment.skillName}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRatingColor(assessment.predictedAIRating)}`}>
                                                    {assessment.predictedAIRating}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {assessment.gaps.length > 0 && (
                                                    <span className="text-xs text-amber-400">{assessment.gaps.length} gap(s)</span>
                                                )}
                                                {expandedSkill === assessment.skillName ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedSkill === assessment.skillName && (
                                            <div className="px-4 pb-4 space-y-4">
                                                {/* Depth Indicators */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.projectCount >= 2 ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">{assessment.narrativeDepth.projectCount} project(s)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.quantifiedImpact ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">Quantified Impact</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.teachingEvidence ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">Teaching Evidence</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.architecturalDecisions ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">Architectural Decisions</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.specificityScore >= 5 ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">Specificity {assessment.narrativeDepth.specificityScore}/10</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {assessment.narrativeDepth.recencyScore >= 7 ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                        )}
                                                        <span className="text-gray-400">Recency {assessment.narrativeDepth.recencyScore}/10</span>
                                                    </div>
                                                </div>

                                                {/* Gaps */}
                                                {assessment.gaps.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-red-400 mb-2">Gaps</h4>
                                                        <ul className="space-y-1">
                                                            {assessment.gaps.map((gap, i) => (
                                                                <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                                    <span className="text-red-400">•</span>
                                                                    {gap}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Recommendations */}
                                                {assessment.recommendations.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-emerald-400 mb-2">Recommendations</h4>
                                                        <ul className="space-y-1">
                                                            {assessment.recommendations.map((rec, i) => (
                                                                <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                                    <span className="text-emerald-400">→</span>
                                                                    {rec}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setResult(null)}
                                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                            >
                                ← New Analysis
                            </button>
                            <Link
                                href="/interview-prep/simulator"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
                            >
                                <Play className="w-4 h-4" />
                                Practice Interview
                            </Link>
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
