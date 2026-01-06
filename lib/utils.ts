import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatQuarter(date: Date = new Date()): string {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${date.getFullYear()}`;
}

export function getReceiptStrengthColor(strength: 'strong' | 'medium' | 'weak'): string {
    switch (strength) {
        case 'strong':
            return 'text-success';
        case 'medium':
            return 'text-warning';
        case 'weak':
            return 'text-muted-foreground';
    }
}

export function getDirectionIcon(classification: string): string {
    switch (classification) {
        case 'appreciating':
            return '▲';
        case 'depreciating':
            return '▼';
        case 'stable':
        case 'stable_uncertain':
            return '─';
        default:
            return '?';
    }
}
