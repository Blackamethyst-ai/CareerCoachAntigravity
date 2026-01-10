import React from 'react';
import { Archetype } from '@/lib/resume-builder/types';
import { Zap, Shield, Network, Brain, Target } from 'lucide-react';

interface ArchetypeSelectorProps {
    selected: Archetype;
    onChange: (archetype: Archetype) => void;
}

export function ArchetypeSelector({ selected, onChange }: ArchetypeSelectorProps) {
    const archetypes: { id: Archetype; label: string; icon: React.ElementType; color: string; desc: string }[] = [
        {
            id: 'general',
            label: 'General',
            icon: Target,
            color: 'text-gray-400',
            desc: 'Standard STAR framing'
        },
        {
            id: 'speed',
            label: 'Speed (xAI)',
            icon: Zap,
            color: 'text-yellow-400',
            desc: 'Friction removal & velocity'
        },
        {
            id: 'safety',
            label: 'Safety (Anthropic)',
            icon: Shield,
            color: 'text-orange-400',
            desc: 'Governance & reliability'
        },
        {
            id: 'creative',
            label: 'Creative (DeepMind)',
            icon: Brain,
            color: 'text-emerald-400',
            desc: 'Innovation & prototyping'
        },
        {
            id: 'ecosystem',
            label: 'Ecosystem (Nvidia)',
            icon: Network,
            color: 'text-blue-400',
            desc: 'Network effects & scale'
        },
    ];

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
                Chameleon Mode (Target Archetype)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {archetypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 text-center h-24 ${selected === type.id
                            ? `bg-${type.color.split('-')[1]}/10 border-${type.color.split('-')[1]} ring-1 ring-${type.color.split('-')[1]}`
                            : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800'
                            }`}
                    >
                        <type.icon className={`w-5 h-5 ${selected === type.id ? type.color : 'text-gray-500'}`} />
                        <div>
                            <div className={`text-xs font-medium ${selected === type.id ? 'text-white' : 'text-gray-400'}`}>
                                {type.label}
                            </div>
                            <div className="text-[10px] text-gray-600 leading-tight mt-1">
                                {type.desc}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
