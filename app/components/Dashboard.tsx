'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCareerBoardStore } from '@/lib/store';
import { getDirectionIcon, getReceiptStrengthColor, formatQuarter } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import Chat from './Chat';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Activity,
    MessageSquare,
    Zap,
    FileText,
    BarChart3,
    Sparkles
} from 'lucide-react';

export default function Dashboard() {
    const {
        problems,
        activeBet,
        receipts,
        avoidedDecisions,
        isChatOpen,
        startSession,
        toggleChat
    } = useCareerBoardStore();

    const getClassificationIcon = (classification: string) => {
        switch (classification) {
            case 'appreciating':
                return <TrendingUp className="w-4 h-4 text-success" />;
            case 'depreciating':
                return <TrendingDown className="w-4 h-4 text-destructive" />;
            default:
                return <Minus className="w-4 h-4 text-warning" />;
        }
    };

    const getReceiptIcon = (type: string) => {
        switch (type) {
            case 'artifact':
                return <FileText className="w-4 h-4" />;
            case 'decision':
                return <CheckCircle className="w-4 h-4" />;
            case 'calendar':
                return <Calendar className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    const depreciatingCount = problems.filter(p => p.classification === 'depreciating').length;
    const riskPercentage = Math.round((depreciatingCount / problems.length) * 100);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">Career Board</h1>
                            <p className="text-xs text-muted-foreground">Human-AI Career Governance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{formatQuarter()}</span>
                        <Link href="/resume-builder">
                            <Button variant="outline">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Resume Builder
                            </Button>
                        </Link>
                        <Button onClick={toggleChat} variant="default">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Weekly Pulse
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Portfolio Health */}
                    <Card hover className="animate-fade-in">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Portfolio Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {problems.map((problem) => (
                                    <div
                                        key={problem.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getClassificationIcon(problem.classification)}
                                            <span className="font-medium text-foreground">{problem.name}</span>
                                        </div>
                                        <span className={`text-sm capitalize ${problem.classification === 'appreciating' ? 'text-success' :
                                            problem.classification === 'depreciating' ? 'text-destructive' :
                                                'text-warning'
                                            }`}>
                                            {problem.classification}
                                        </span>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Risk Exposure</span>
                                        <span className={`font-medium ${riskPercentage > 30 ? 'text-destructive' : 'text-success'}`}>
                                            {riskPercentage}% on depreciating
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Bet */}
                    <Card hover className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Active Bet
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeBet ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-secondary/50 border-l-4 border-primary">
                                        <p className="text-foreground font-medium leading-relaxed">
                                            "{activeBet.prediction}"
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <p className="text-sm">
                                            <span className="text-destructive font-medium">Wrong if: </span>
                                            <span className="text-muted-foreground">{activeBet.wrongIf}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Quarter: {activeBet.quarter}</span>
                                        <Button variant="outline" size="sm">Update Status</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No active bet</p>
                                    <Button variant="outline" size="sm" className="mt-3">Create Bet</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Avoided Decisions */}
                    <Card hover className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                Avoided Decisions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {avoidedDecisions.length > 0 ? (
                                <div className="space-y-4">
                                    {avoidedDecisions.map((decision) => (
                                        <div
                                            key={decision.id}
                                            className="p-4 rounded-lg bg-warning/5 border border-warning/20"
                                        >
                                            <p className="font-medium text-foreground mb-2">{decision.what}</p>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                <span className="text-warning">Why: </span>{decision.whyAvoiding}
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                <span className="text-destructive">Cost: </span>{decision.cost}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-warning">
                                                    Stalled for {decision.weeksStalled} weeks
                                                </span>
                                                <Button variant="outline" size="sm">Resolve →</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success opacity-50" />
                                    <p>No avoided decisions tracked</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Receipts */}
                    <Card hover className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                Receipts ({formatQuarter()})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {receipts.length > 0 ? (
                                <div className="space-y-3">
                                    {receipts.map((receipt) => (
                                        <div
                                            key={receipt.id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                                        >
                                            <div className={`p-2 rounded-lg bg-secondary ${getReceiptStrengthColor(receipt.strength)}`}>
                                                {getReceiptIcon(receipt.type)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">{receipt.description}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{receipt.type} • {receipt.strength}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No receipts logged this quarter</p>
                                    <Button variant="outline" size="sm" className="mt-3">Log Receipt</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Session Buttons */}
                <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Start Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button
                                variant="secondary"
                                className="h-auto py-4 flex-col items-start text-left"
                                onClick={() => startSession('quick_audit')}
                            >
                                <Zap className="w-5 h-5 mb-2 text-warning" />
                                <span className="font-medium">Quick Audit</span>
                                <span className="text-xs text-muted-foreground mt-1">15 min assessment</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-auto py-4 flex-col items-start text-left"
                                onClick={() => startSession('setup')}
                            >
                                <FileText className="w-5 h-5 mb-2 text-primary" />
                                <span className="font-medium">Setup Portfolio</span>
                                <span className="text-xs text-muted-foreground mt-1">Full problem mapping</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-auto py-4 flex-col items-start text-left"
                                onClick={() => startSession('quarterly')}
                            >
                                <BarChart3 className="w-5 h-5 mb-2 text-success" />
                                <span className="font-medium">Quarterly Review</span>
                                <span className="text-xs text-muted-foreground mt-1">Deep accountability</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-auto py-4 flex-col items-start text-left"
                                onClick={() => startSession('weekly')}
                            >
                                <Calendar className="w-5 h-5 mb-2 text-primary" />
                                <span className="font-medium">Weekly Pulse</span>
                                <span className="text-xs text-muted-foreground mt-1">Quick check-in</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Chat Modal */}
            {isChatOpen && <Chat />}
        </div>
    );
}
