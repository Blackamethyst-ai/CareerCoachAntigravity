import React from 'react';

interface ScoreBarProps {
    label: string;
    score: number;
    weight: number;
}

export const ScoreBar = ({ label, score, weight }: ScoreBarProps) => {
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
                <span className="text-white font-medium">
                    {score.toFixed(0)}% <span className="text-gray-500">({(weight * 100).toFixed(0)}%)</span>
                </span>
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
