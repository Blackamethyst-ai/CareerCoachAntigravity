'use client';

import React from 'react';
import { useCareerBoardStore } from '@/lib/store';
import { Sparkles, Network } from 'lucide-react';

export function NexusIndicator() {
    const nexusState = useCareerBoardStore(state => state.nexusState);

    if (nexusState.status === 'idle') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900/90 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
                {nexusState.status === 'weaving' ? (
                    <div className="relative">
                        <Network className="w-5 h-5 text-purple-400 animate-pulse" />
                        <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full animate-ping" />
                    </div>
                ) : (
                    <div className="relative">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                )}

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        NEXUS ENGINE
                    </span>
                    <span className="text-xs text-gray-400">
                        {nexusState.status === 'weaving' ? 'Weaving Systems...' : 'Strategic Gem Crystallized'}
                    </span>
                </div>

                {nexusState.status === 'crystallized' && (
                    <button
                        onClick={() => useCareerBoardStore.getState().updateNexusState({ status: 'idle' })}
                        className="ml-2 p-1 hover:bg-white/10 rounded-full"
                    >
                        <span className="sr-only">Dismiss</span>
                        <div className="w-4 h-4 text-gray-500 hover:text-white text-xs flex items-center justify-center">×</div>
                    </button>
                )}
            </div>
        </div>
    );
}
