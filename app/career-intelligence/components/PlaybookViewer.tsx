'use client';

import React, { useState } from 'react';
import { Book, ChevronRight, CheckCircle, Target, Shield, Zap, Network } from 'lucide-react';
import { POSITIONING_PLAYBOOK } from '@/lib/playbooks/positioning_playbook';

const ICONS = {
    xAI: <Zap className="w-4 h-4 text-yellow-400" />,
    Anthropic: <Shield className="w-4 h-4 text-orange-400" />,
    "Google DeepMind": <Book className="w-4 h-4 text-blue-400" />,
    Nvidia: <Network className="w-4 h-4 text-green-400" />,
    SpaceX: <Target className="w-4 h-4 text-red-400" />,
};

type PlaybookPhase = typeof POSITIONING_PLAYBOOK.phases[0];

export default function PlaybookViewer() {
    const [selectedPhase, setSelectedPhase] = useState<PlaybookPhase>(POSITIONING_PLAYBOOK.phases[0]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Phase Navigation */}
            <div className="space-y-3">
                {POSITIONING_PLAYBOOK.phases.map((phase) => (
                    <button
                        key={phase.id}
                        onClick={() => setSelectedPhase(phase)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPhase.id === phase.id
                                ? 'bg-purple-600/20 border-purple-500/50 text-white'
                                : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono uppercase tracking-wider opacity-70">
                                Phase {phase.id}
                            </span>
                            {selectedPhase.id === phase.id && <ChevronRight className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="font-semibold text-sm">{phase.title}</div>
                    </button>
                ))}
            </div>

            {/* Phase Content */}
            <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl">
                    <div className="mb-6">
                        <div className="text-xs font-mono text-purple-400 mb-2">PHASE {selectedPhase.id}</div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedPhase.title}</h2>
                        <p className="text-gray-400">{selectedPhase.goal}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Recursive rendering based on phase structure */}
                        {/* Steps */}
                        {'steps' in selectedPhase && (selectedPhase as any).steps?.map((step: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-400">
                                        {i + 1}
                                    </div>
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-300 mb-3 ml-8">{step.description}</p>

                                {step.outcome && (
                                    <div className="ml-8 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">
                                        <strong className="text-emerald-400">Outcome:</strong> {step.outcome}
                                    </div>
                                )}

                                {step.example && typeof step.example === 'string' && (
                                    <div className="ml-8 text-sm text-gray-400 italic border-l-2 border-gray-600 pl-3">
                                        "{step.example}"
                                    </div>
                                )}

                                {step.metrics && (
                                    <div className="ml-8 grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                                        {step.metrics.map((m: any, j: number) => (
                                            <div key={j} className="p-2 rounded bg-gray-900 border border-gray-800 text-xs">
                                                <div className="text-gray-500 mb-1">{m.type}</div>
                                                <div className="text-white font-medium">{m.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step.variations && (
                                    <div className="ml-8 space-y-2 mt-3">
                                        {step.variations.map((v: any, j: number) => (
                                            <div key={j} className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                                                    {ICONS[v.target as keyof typeof ICONS] || <Target className="w-4 h-4" />}
                                                    {v.target}
                                                </div>
                                                <div className="text-xs text-purple-300 mb-1">{v.title}</div>
                                                <div className="text-xs text-gray-400">{v.focus}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Plays (Phase 4 specifically) */}
                        {'plays' in selectedPhase && (selectedPhase as any).plays?.map((play: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        {ICONS[play.target as keyof typeof ICONS] || <Target className="w-4 h-4" />}
                                        {play.name}
                                    </h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                                        Target: {play.target}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">The Hook</div>
                                        <div className="text-sm text-gray-300">{play.hook}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">The Narrative</div>
                                        <div className="text-sm text-gray-300 italic border-l-2 border-purple-500 pl-3">
                                            "{play.narrative}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
