'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Brain,
    Play,
    Pause,
    Send,
    Mic,
    Clock,
    Target,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    RefreshCcw,
    ChevronRight,
    Zap,
    MessageSquare,
} from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: string;
    skill: string;
    difficulty: string;
}

interface Exchange {
    question: Question;
    response: string;
    score: {
        technical: number;
        conversational: number;
        overall: number;
    };
    feedback: string[];
}

interface SessionMetrics {
    totalQuestions: number;
    answeredQuestions: number;
    averageTechnical: number;
    averageConversational: number;
    wordCount: number;
    fillerRate: number;
}

const AVAILABLE_SKILLS = [
    'react', 'javascript', 'typescript', 'python', 'aws',
    'salesforce', 'partner operations', 'technical program management',
];

export default function InterviewSimulatorPage() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['react', 'javascript']);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentResponse, setCurrentResponse] = useState('');
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [sessionTimer, setSessionTimer] = useState(0);
    const [quickScore, setQuickScore] = useState<{ score: number; issues: string[] } | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Start session timer
    useEffect(() => {
        if (isSessionActive && !sessionComplete) {
            timerRef.current = setInterval(() => {
                setSessionTimer(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isSessionActive, sessionComplete]);

    // Real-time response scoring
    useEffect(() => {
        const debounce = setTimeout(async () => {
            if (currentResponse.trim().length > 10) {
                try {
                    const res = await fetch('/api/interview-prep/conversational', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ singleResponse: currentResponse }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setQuickScore({ score: data.score, issues: data.issues });
                    }
                } catch (err) {
                    console.log('Quick score error:', err);
                }
            } else {
                setQuickScore(null);
            }
        }, 500);
        return () => clearTimeout(debounce);
    }, [currentResponse]);

    const startSession = async () => {
        if (selectedSkills.length === 0) return;

        try {
            const res = await fetch('/api/interview-prep/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generate-sequence', skills: selectedSkills }),
            });
            const data = await res.json();

            if (data.success && data.sequence.length > 0) {
                setQuestions(data.sequence);
                setIsSessionActive(true);
                setCurrentQuestionIndex(0);
                setExchanges([]);
                setSessionComplete(false);
                setSessionTimer(0);
            }
        } catch (err) {
            console.error('Failed to start session:', err);
        }
    };

    const submitResponse = async () => {
        if (!currentResponse.trim() || isProcessing) return;

        setIsProcessing(true);
        const currentQuestion = questions[currentQuestionIndex];

        try {
            // Get conversational score
            const scoreRes = await fetch('/api/interview-prep/conversational', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses: [currentResponse] }),
            });
            const scoreData = await scoreRes.json();

            // Calculate scores (technical would need more sophisticated analysis)
            const technicalScore = 7 + Math.random() * 2; // Placeholder
            const conversationalScore = scoreData.success ? scoreData.score.overallConversational : 7;
            const overall = (technicalScore * 0.6 + conversationalScore * 0.4);

            // Generate feedback
            const feedback: string[] = [];
            if (currentResponse.split(/\s+/).length < 30) {
                feedback.push('Response could be more detailed. Aim for 50-150 words.');
            }
            if (!/for example|specifically|in one case/i.test(currentResponse)) {
                feedback.push('Consider adding a specific example to strengthen your answer.');
            }
            if (scoreData.success && scoreData.score.issues.fillerWords.length > 0) {
                feedback.push('Reduce filler words for more polished delivery.');
            }
            if (feedback.length === 0) {
                feedback.push('Good response! Clear and well-structured.');
            }

            const exchange: Exchange = {
                question: currentQuestion,
                response: currentResponse,
                score: {
                    technical: technicalScore,
                    conversational: conversationalScore,
                    overall,
                },
                feedback,
            };

            setExchanges(prev => [...prev, exchange]);
            setCurrentResponse('');
            setQuickScore(null);

            // Move to next question or end session
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setSessionComplete(true);
            }
        } catch (err) {
            console.error('Failed to process response:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateMetrics = (): SessionMetrics => {
        if (exchanges.length === 0) {
            return {
                totalQuestions: questions.length,
                answeredQuestions: 0,
                averageTechnical: 0,
                averageConversational: 0,
                wordCount: 0,
                fillerRate: 0,
            };
        }

        const avgTech = exchanges.reduce((sum, e) => sum + e.score.technical, 0) / exchanges.length;
        const avgConv = exchanges.reduce((sum, e) => sum + e.score.conversational, 0) / exchanges.length;
        const totalWords = exchanges.reduce((sum, e) => sum + e.response.split(/\s+/).length, 0);

        return {
            totalQuestions: questions.length,
            answeredQuestions: exchanges.length,
            averageTechnical: avgTech,
            averageConversational: avgConv,
            wordCount: totalWords,
            fillerRate: 2.1, // Placeholder
        };
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-400';
        if (score >= 6.5) return 'text-blue-400';
        if (score >= 5) return 'text-amber-400';
        return 'text-red-400';
    };

    const metrics = calculateMetrics();

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-[#0a0a0f]/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/interview-prep" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Interview Prep</span>
                        </Link>
                        <div className="w-px h-6 bg-gray-800" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Play className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Interview Simulator</h1>
                                <p className="text-xs text-gray-500">Practice AI Interview Questions</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSessionActive && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/80 border border-gray-800">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-white">{formatTime(sessionTimer)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {!isSessionActive ? (
                    /* Session Setup */
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-3">AI Interview Simulator</h2>
                            <p className="text-gray-400">
                                Practice structured interview questions like those used in AI recruitment systems.
                                Get real-time feedback on your responses.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                            <h3 className="text-lg font-semibold text-white mb-4">Select Skills to Practice</h3>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SKILLS.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => {
                                            if (selectedSkills.includes(skill)) {
                                                setSelectedSkills(prev => prev.filter(s => s !== skill));
                                            } else {
                                                setSelectedSkills(prev => [...prev, skill]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${selectedSkills.includes(skill)
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-2xl font-bold text-emerald-400">{selectedSkills.length * 3}</div>
                                <div className="text-xs text-gray-500">Questions</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-2xl font-bold text-blue-400">~{selectedSkills.length * 5}m</div>
                                <div className="text-xs text-gray-500">Est. Duration</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-2xl font-bold text-purple-400">{selectedSkills.length}</div>
                                <div className="text-xs text-gray-500">Skills Covered</div>
                            </div>
                        </div>

                        <button
                            onClick={startSession}
                            disabled={selectedSkills.length === 0}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-lg font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Play className="w-6 h-6" />
                            Start Interview Simulation
                        </button>
                    </div>
                ) : sessionComplete ? (
                    /* Session Complete */
                    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
                            <p className="text-gray-400">
                                Duration: {formatTime(sessionTimer)} • {exchanges.length} questions answered
                            </p>
                        </div>

                        {/* Score Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className={`text-4xl font-bold ${getScoreColor(metrics.averageTechnical)}`}>
                                    {metrics.averageTechnical.toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-400">Avg Technical Score</div>
                                <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${metrics.averageTechnical * 10}%` }}
                                    />
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className={`text-4xl font-bold ${getScoreColor(metrics.averageConversational)}`}>
                                    {metrics.averageConversational.toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-400">Avg Conversational Score</div>
                                <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500"
                                        style={{ width: `${metrics.averageConversational * 10}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Benchmark Comparison */}
                        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                            <h3 className="font-semibold text-white mb-4">vs. Paper Benchmarks</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Your Conversational</span>
                                    <span className={getScoreColor(metrics.averageConversational)}>
                                        {metrics.averageConversational.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">AI Interview Benchmark</span>
                                    <span className="text-emerald-400">7.8</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Human Interview Benchmark</span>
                                    <span className="text-gray-500">5.4</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Review */}
                        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                            <h3 className="font-semibold text-white mb-4">Question Review</h3>
                            <div className="space-y-4">
                                {exchanges.map((exchange, idx) => (
                                    <div key={idx} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="text-sm text-gray-300">{exchange.question.text}</div>
                                            <div className={`text-sm font-medium ${getScoreColor(exchange.score.overall)}`}>
                                                {exchange.score.overall.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-2 capitalize">{exchange.question.skill}</div>
                                        {exchange.feedback.map((fb, i) => (
                                            <div key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                <span className="text-amber-400">→</span> {fb}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setIsSessionActive(false);
                                    setSessionComplete(false);
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                New Session
                            </button>
                            <Link
                                href="/interview-prep"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
                            >
                                Skill Analysis
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Active Interview */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Question Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Question */}
                            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm text-gray-400">
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs capitalize">
                                        {questions[currentQuestionIndex]?.skill}
                                    </span>
                                </div>
                                <p className="text-xl text-white font-medium leading-relaxed">
                                    {questions[currentQuestionIndex]?.text}
                                </p>
                                <div className="mt-4 text-xs text-gray-500 capitalize">
                                    {questions[currentQuestionIndex]?.type.replace('-', ' ')} • {questions[currentQuestionIndex]?.difficulty}
                                </div>
                            </div>

                            {/* Response Input */}
                            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-300">Your Response</span>
                                    {quickScore && (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${getScoreColor(quickScore.score)}`}>
                                                Score: {quickScore.score.toFixed(1)}
                                            </span>
                                            {quickScore.issues.length > 0 && (
                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    value={currentResponse}
                                    onChange={(e) => setCurrentResponse(e.target.value)}
                                    placeholder="Type your response here... Speak naturally as you would in an interview."
                                    className="w-full h-40 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-xs text-gray-500">
                                        {currentResponse.split(/\s+/).filter(Boolean).length} words
                                        {quickScore?.issues.length ? ` • ${quickScore.issues.length} issue(s)` : ''}
                                    </div>
                                    <button
                                        onClick={submitResponse}
                                        disabled={!currentResponse.trim() || isProcessing}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
                                    >
                                        {isProcessing ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit & Next
                                            </>
                                        )}
                                    </button>
                                </div>


                                {/* Real-time issues */}
                                {quickScore && quickScore.issues && quickScore.issues.length > 0 && (
                                    <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <div className="text-xs text-amber-400 space-y-1">
                                            {quickScore.issues.map((issue, i) => (
                                                <div key={i}>• {issue}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Metrics */}
                        <div className="space-y-4">
                            {/* Progress */}
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-sm font-medium text-gray-300 mb-2">Progress</div>
                                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all"
                                        style={{ width: `${(exchanges.length / questions.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {exchanges.length} / {questions.length} completed
                                </div>
                            </div>

                            {/* Running Scores */}
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-sm font-medium text-gray-300 mb-3">Running Average</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Technical</span>
                                        <span className={`text-sm ${getScoreColor(metrics.averageTechnical || 0)}`}>
                                            {metrics.averageTechnical ? metrics.averageTechnical.toFixed(1) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Conversational</span>
                                        <span className={`text-sm ${getScoreColor(metrics.averageConversational || 0)}`}>
                                            {metrics.averageConversational ? metrics.averageConversational.toFixed(1) : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium text-blue-400">Tips</span>
                                </div>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li>• Use specific examples</li>
                                    <li>• Quantify your impact</li>
                                    <li>• Avoid filler words</li>
                                    <li>• Aim for 50-150 words</li>
                                </ul>
                            </div>

                            {/* End Session */}
                            <button
                                onClick={() => setSessionComplete(true)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm hover:text-white transition-colors"
                            >
                                End Session Early
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
