'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Briefcase,
    Target,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ArrowLeft,
    Sparkles,
    BarChart3,
    Zap,
    Upload,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface MatchResult {
    keywordScore: number;
    experienceScore: number;
    skillsScore: number;
    impactScore: number;
    recencyScore: number;
    cultureScore: number;
    totalScore: number;
    matchTier: string;
    keywordsMatched: string[];
    keywordsMissing: string[];
    skillsMatched: string[];
    skillsMissing: string[];
    experienceDirect: string[];
    experienceTransferable: string[];
    experienceGaps: string[];
    overqualified: boolean;
    underqualified: boolean;
    recommendations: string[];
}

interface AnalysisResponse {
    success: boolean;
    result: MatchResult;
    report: string;
    profile: {
        name: string;
        skillsCount: number;
        experienceCount: number;
        yearsExperience: number;
    };
    job: {
        title: string;
        company: string;
        requirementsCount: number;
        yearsRequired?: number;
    };
}

// Default master profile - loaded from CareerResumeBuilder
const DEFAULT_PROFILE_PATH = '/CareerResumeBuilder/dico-angelo-master-profile-v3-final.md';

export default function ResumeBuilderPage() {
    const [profileText, setProfileText] = useState('');
    const [jobText, setJobText] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showFullReport, setShowFullReport] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        keywords: false,
        skills: false,
        experience: false,
    });

    // Load default profile on mount
    useEffect(() => {
        async function loadDefaultProfile() {
            try {
                const response = await fetch(DEFAULT_PROFILE_PATH);
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
        if (!profileText.trim() || !jobText.trim()) {
            setError('Please provide both your profile and a job description');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/resume-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileText,
                    jobText,
                    jobTitle: jobTitle || undefined,
                    company: company || undefined,
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

    const getTierInfo = (tier: string) => {
        switch (tier) {
            case 'STRONG_MATCH':
                return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Strong Match' };
            case 'MODERATE_MATCH':
                return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Moderate Match' };
            case 'WEAK_MATCH':
                return { icon: TrendingDown, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', label: 'Weak Match' };
            default:
                return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: 'No Match' };
        }
    };

    const ScoreBar = ({ label, score, weight }: { label: string; score: number; weight: number }) => {
        const weighted = score * weight;
        const getScoreColor = (s: number) => {
            if (s >= 75) return 'bg-emerald-500';
            if (s >= 50) return 'bg-amber-500';
            if (s >= 25) return 'bg-orange-500';
            return 'bg-red-500';
        };

        return (
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-medium">{score.toFixed(0)}% <span className="text-gray-500">({(weight * 100).toFixed(0)}%)</span></span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getScoreColor(score)} transition-all duration-500`}
                        style={{ width: `${Math.min(100, score)}%` }}
                    />
                </div>
            </div>
        );
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-[#0a0a0f]/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Dashboard</span>
                        </Link>
                        <div className="w-px h-6 bg-gray-800" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Resume Builder</h1>
                                <p className="text-xs text-gray-500">AI-Powered Match Analysis</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                            <span className="text-xs text-violet-400 font-medium">v3.0</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {!result ? (
                    /* Input Form */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Master Profile */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <FileText className="w-4 h-4 text-violet-400" />
                                    Master Profile
                                </label>
                                {isLoadingProfile && (
                                    <span className="text-xs text-gray-500">Loading default profile...</span>
                                )}
                            </div>
                            <div className="relative">
                                <textarea
                                    value={profileText}
                                    onChange={(e) => setProfileText(e.target.value)}
                                    placeholder="Paste your master profile here..."
                                    className="w-full h-80 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none font-mono text-sm"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                                    {profileText.length.toLocaleString()} chars
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Briefcase className="w-4 h-4 text-blue-400" />
                                Job Description
                            </label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="Job Title (optional)"
                                    className="px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                                />
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Company (optional)"
                                    className="px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <textarea
                                    value={jobText}
                                    onChange={(e) => setJobText(e.target.value)}
                                    placeholder="Paste the job description here..."
                                    className="w-full h-64 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                                    {jobText.length.toLocaleString()} chars
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="lg:col-span-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Analyze Button */}
                        <div className="lg:col-span-2 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !profileText.trim() || !jobText.trim()}
                                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                        Analyze Match
                                        <Zap className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Results View */
                    <div className="space-y-6 animate-fade-in">
                        {/* Score Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Score Card */}
                            <div className={`lg:col-span-1 p-6 rounded-2xl ${getTierInfo(result.result.matchTier).bg} border ${getTierInfo(result.result.matchTier).border} backdrop-blur-xl`}>
                                <div className="text-center">
                                    <div className="mb-4">
                                        {React.createElement(getTierInfo(result.result.matchTier).icon, {
                                            className: `w-16 h-16 mx-auto ${getTierInfo(result.result.matchTier).color}`,
                                        })}
                                    </div>
                                    <div className="text-6xl font-bold text-white mb-2">
                                        {result.result.totalScore.toFixed(0)}%
                                    </div>
                                    <div className={`text-lg font-medium ${getTierInfo(result.result.matchTier).color}`}>
                                        {getTierInfo(result.result.matchTier).label}
                                    </div>
                                    <div className="mt-4 text-sm text-gray-400">
                                        {result.job.title} @ {result.job.company}
                                    </div>

                                    {/* Flags */}
                                    {(result.result.overqualified || result.result.underqualified) && (
                                        <div className="mt-4 space-y-2">
                                            {result.result.overqualified && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Overqualified - Negotiate!
                                                </div>
                                            )}
                                            {result.result.underqualified && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Address gaps in cover letter
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                                    <BarChart3 className="w-5 h-5 text-violet-400" />
                                    Score Breakdown
                                </h3>
                                <div className="space-y-4">
                                    <ScoreBar label="Keyword Alignment" score={result.result.keywordScore} weight={0.25} />
                                    <ScoreBar label="Experience Relevance" score={result.result.experienceScore} weight={0.25} />
                                    <ScoreBar label="Skills Coverage" score={result.result.skillsScore} weight={0.20} />
                                    <ScoreBar label="Quantified Impact" score={result.result.impactScore} weight={0.15} />
                                    <ScoreBar label="Recency Match" score={result.result.recencyScore} weight={0.10} />
                                    <ScoreBar label="Culture Signals" score={result.result.cultureScore} weight={0.05} />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Keywords */}
                            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                                <button
                                    onClick={() => toggleSection('keywords')}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                        <Target className="w-5 h-5 text-blue-400" />
                                        Keywords Analysis
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                                            {result.result.keywordsMatched.length} matched
                                        </span>
                                    </h3>
                                    {expandedSections.keywords ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {expandedSections.keywords && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-emerald-400 mb-2">✓ Matched</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.result.keywordsMatched.slice(0, 15).map((kw, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs">
                                                        {kw}
                                                    </span>
                                                ))}
                                                {result.result.keywordsMatched.length > 15 && (
                                                    <span className="px-2 py-1 text-gray-500 text-xs">
                                                        +{result.result.keywordsMatched.length - 15} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-red-400 mb-2">✗ Missing</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.result.keywordsMissing.slice(0, 10).map((kw, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs">
                                                        {kw}
                                                    </span>
                                                ))}
                                                {result.result.keywordsMissing.length > 10 && (
                                                    <span className="px-2 py-1 text-gray-500 text-xs">
                                                        +{result.result.keywordsMissing.length - 10} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                                <button
                                    onClick={() => toggleSection('experience')}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                        <Briefcase className="w-5 h-5 text-purple-400" />
                                        Experience Classification
                                    </h3>
                                    {expandedSections.experience ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {expandedSections.experience && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-emerald-400 mb-2">
                                                ✓ Direct Match ({result.result.experienceDirect.length})
                                            </h4>
                                            {result.result.experienceDirect.slice(0, 3).map((exp, i) => (
                                                <p key={i} className="text-xs text-gray-400 mb-1 pl-3 border-l-2 border-emerald-500/30">
                                                    {exp.slice(0, 100)}...
                                                </p>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-amber-400 mb-2">
                                                ⚡ Transferable ({result.result.experienceTransferable.length})
                                            </h4>
                                            {result.result.experienceTransferable.slice(0, 3).map((exp, i) => (
                                                <p key={i} className="text-xs text-gray-400 mb-1 pl-3 border-l-2 border-amber-500/30">
                                                    {exp.slice(0, 100)}...
                                                </p>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-red-400 mb-2">
                                                ✗ Gaps ({result.result.experienceGaps.length})
                                            </h4>
                                            {result.result.experienceGaps.slice(0, 3).map((exp, i) => (
                                                <p key={i} className="text-xs text-gray-400 mb-1 pl-3 border-l-2 border-red-500/30">
                                                    {exp.slice(0, 100)}...
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 backdrop-blur-xl">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                <Sparkles className="w-5 h-5 text-violet-400" />
                                Recommendations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.result.recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
                                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
                                        </div>
                                        <p className="text-sm text-gray-300">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Report Toggle */}
                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <button
                                onClick={() => setShowFullReport(!showFullReport)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    Full Markdown Report
                                </h3>
                                {showFullReport ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {showFullReport && (
                                <pre className="mt-4 p-4 rounded-lg bg-gray-950 text-gray-300 text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                                    {result.report}
                                </pre>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setResult(null)}
                                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                            >
                                ← New Analysis
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.report);
                                }}
                                className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
                            >
                                Copy Report
                            </button>
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
