import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// GET - Retrieve portfolio
export async function GET() {
    try {
        await ensureDataDir();

        try {
            const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
            return NextResponse.json(JSON.parse(data));
        } catch {
            // Return empty portfolio if file doesn't exist
            return NextResponse.json({
                id: 'portfolio_default',
                problems: [],
                risk: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastReviewedAt: null,
            });
        }
    } catch (error) {
        console.error('Portfolio GET error:', error);
        return NextResponse.json({ error: 'Failed to read portfolio' }, { status: 500 });
    }
}

// POST - Create/Update portfolio
export async function POST(request: NextRequest) {
    try {
        await ensureDataDir();
        const portfolio = await request.json();

        portfolio.updatedAt = new Date().toISOString();
        if (!portfolio.createdAt) {
            portfolio.createdAt = portfolio.updatedAt;
        }

        await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(portfolio, null, 2));
        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Portfolio POST error:', error);
        return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
    }
}
