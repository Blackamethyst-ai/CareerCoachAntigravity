/**
 * Career Board Tool Definitions
 * 
 * Tools for agentic mode - calendar verification, artifact search, 
 * receipt logging, reminders, and drift detection.
 */

import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ReceiptType = 'decision' | 'artifact' | 'calendar' | 'proxy';
export type ReceiptStrength = 'strong' | 'medium' | 'weak';
export type BetResult = 'happened' | 'didnt' | 'partial';
export type DocumentSource = 'drive' | 'notion' | 'github' | 'dropbox' | 'local';

// ============================================================================
// TOOL SCHEMAS (for Claude tool_use)
// ============================================================================

export const toolSchemas = {
  check_calendar: {
    name: 'check_calendar',
    description: `Verify if meetings or time blocks exist in the user's calendar. 
Use this to validate claims about meetings held, time allocated, or conversations had.
Returns matching calendar entries with dates and attendees.`,
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term - meeting title, attendee name, or topic',
        },
        dateRange: {
          type: 'string',
          description: 'Time period to search, e.g., "last 30 days", "Q1 2025", "2025-01-01 to 2025-03-31"',
        },
      },
      required: ['query', 'dateRange'],
    },
  },

  search_artifacts: {
    name: 'search_artifacts',
    description: `Search connected document sources for shipped work, deliverables, or evidence.
Use this to verify claims about artifacts created, documents shipped, or work completed.
Returns matching files with titles, dates, and links.`,
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term - document title, project name, or content keywords',
        },
        sources: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['drive', 'notion', 'github', 'dropbox', 'local'],
          },
          description: 'Which sources to search',
        },
        dateRange: {
          type: 'string',
          description: 'Optional time period filter',
        },
      },
      required: ['query', 'sources'],
    },
  },

  send_reminder: {
    name: 'send_reminder',
    description: `Schedule a reminder about an avoided decision, bet deadline, or follow-up.
Use when:
- An avoided decision has been stalled for 2+ weeks
- A bet deadline is approaching
- User commits to an action that needs follow-up`,
    input_schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The reminder message - be specific about what needs attention',
        },
        timing: {
          type: 'string',
          description: 'When to send: "tomorrow 9am", "monday", "in 1 week", "2025-02-01"',
        },
        escalation: {
          type: 'number',
          description: 'Escalation level 1-3. Higher = more urgent framing',
          default: 1,
        },
        linkedTo: {
          type: 'string',
          description: 'Optional: ID of the avoided decision or bet this relates to',
        },
      },
      required: ['message', 'timing'],
    },
  },

  log_receipt: {
    name: 'log_receipt',
    description: `Record a verified receipt with evidence.
Use after verifying a claim through search_artifacts or check_calendar.
Receipts are the core evidence in quarterly reviews.`,
    input_schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['decision', 'artifact', 'calendar', 'proxy'],
          description: 'Receipt type - affects strength rating',
        },
        description: {
          type: 'string',
          description: 'What the receipt represents',
        },
        evidence: {
          type: 'string',
          description: 'URL, file path, or specific reference to the evidence',
        },
        linkedTo: {
          type: 'string',
          description: 'Problem ID or Bet ID this receipt supports',
        },
        date: {
          type: 'string',
          description: 'When this receipt was created/occurred (ISO date)',
        },
      },
      required: ['type', 'description', 'evidence', 'linkedTo'],
    },
  },

  update_bet_status: {
    name: 'update_bet_status',
    description: `Mark a bet as resolved with evidence.
Use when a bet's deadline has passed or clear evidence exists.
This closes the bet and records the outcome for quarterly review.`,
    input_schema: {
      type: 'object',
      properties: {
        betId: {
          type: 'string',
          description: 'The bet ID to update',
        },
        result: {
          type: 'string',
          enum: ['happened', 'didnt', 'partial'],
          description: 'The outcome',
        },
        evidence: {
          type: 'string',
          description: 'Specific evidence supporting this result',
        },
      },
      required: ['betId', 'result', 'evidence'],
    },
  },

  flag_drift: {
    name: 'flag_drift',
    description: `Create an alert when portfolio direction may be shifting.
Use when you notice:
- Time allocation doesn't match direction labels
- Receipts clustering in depreciating areas
- Appreciating problems being neglected
- External signals suggesting classification change`,
    input_schema: {
      type: 'object',
      properties: {
        problemId: {
          type: 'string',
          description: 'The problem ID showing drift',
        },
        signal: {
          type: 'string',
          description: 'Specific observation indicating drift',
        },
        suggestedAction: {
          type: 'string',
          description: 'Recommended response or board role to engage',
        },
        severity: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'How urgent is this drift signal',
          default: 'medium',
        },
      },
      required: ['problemId', 'signal', 'suggestedAction'],
    },
  },

  get_portfolio: {
    name: 'get_portfolio',
    description: `Retrieve the current problem portfolio and board roles.
Use at the start of sessions to load context.`,
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  get_active_bet: {
    name: 'get_active_bet',
    description: `Retrieve the current active bet and its status.
Use to check bet details, deadline, and falsification criteria.`,
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  get_avoided_decisions: {
    name: 'get_avoided_decisions',
    description: `Retrieve all tracked avoided decisions and their status.
Returns decisions with how long they've been stalled.`,
    input_schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'resolved', 'all'],
          default: 'active',
        },
      },
      required: [],
    },
  },
};

// ============================================================================
// TOOL HANDLERS (Implementation stubs)
// ============================================================================

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const toolHandlers = {
  async check_calendar(params: {
    query: string;
    dateRange: string;
  }): Promise<ToolResult> {
    // Integration with Google Calendar / Outlook
    // Returns: { success: true, data: { entries: [...], count: N } }
    
    // TODO: Implement calendar API integration
    return {
      success: false,
      error: 'Calendar integration not configured. Add GOOGLE_CALENDAR_CREDENTIALS to .env',
    };
  },

  async search_artifacts(params: {
    query: string;
    sources: DocumentSource[];
    dateRange?: string;
  }): Promise<ToolResult> {
    // Integration with Drive, Notion, GitHub, etc.
    // Returns: { success: true, data: { files: [...], count: N } }
    
    // TODO: Implement document source integrations
    const results: any[] = [];
    
    for (const source of params.sources) {
      switch (source) {
        case 'drive':
          // Google Drive API search
          break;
        case 'notion':
          // Notion API search
          break;
        case 'github':
          // GitHub API search (commits, PRs, issues)
          break;
        case 'local':
          // Local file system search
          break;
      }
    }
    
    return {
      success: true,
      data: { files: results, count: results.length },
    };
  },

  async send_reminder(params: {
    message: string;
    timing: string;
    escalation?: number;
    linkedTo?: string;
  }): Promise<ToolResult> {
    // Schedule notification via email, push, or in-app
    // Returns: { success: true, data: { scheduledFor: Date, id: string } }
    
    // TODO: Implement notification scheduling
    return {
      success: true,
      data: {
        scheduledFor: params.timing,
        id: `reminder_${Date.now()}`,
        message: params.message,
      },
    };
  },

  async log_receipt(params: {
    type: ReceiptType;
    description: string;
    evidence: string;
    linkedTo: string;
    date?: string;
  }): Promise<ToolResult> {
    // Store receipt in database
    // Returns: { success: true, data: { id: string, strength: ReceiptStrength } }
    
    const strength: ReceiptStrength = 
      params.type === 'decision' || params.type === 'artifact' ? 'strong' :
      params.type === 'proxy' ? 'medium' : 'weak';
    
    const receipt = {
      id: `receipt_${Date.now()}`,
      ...params,
      strength,
      createdAt: new Date().toISOString(),
    };
    
    // TODO: Save to database
    
    return {
      success: true,
      data: receipt,
    };
  },

  async update_bet_status(params: {
    betId: string;
    result: BetResult;
    evidence: string;
  }): Promise<ToolResult> {
    // Update bet in database
    // Returns: { success: true, data: { bet: Bet } }
    
    // TODO: Load bet, update, save
    
    return {
      success: true,
      data: {
        betId: params.betId,
        result: params.result,
        evidence: params.evidence,
        resolvedAt: new Date().toISOString(),
      },
    };
  },

  async flag_drift(params: {
    problemId: string;
    signal: string;
    suggestedAction: string;
    severity?: 'low' | 'medium' | 'high';
  }): Promise<ToolResult> {
    // Create drift alert
    // Returns: { success: true, data: { alertId: string } }
    
    const alert = {
      id: `drift_${Date.now()}`,
      ...params,
      severity: params.severity || 'medium',
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };
    
    // TODO: Save alert, potentially notify user
    
    return {
      success: true,
      data: alert,
    };
  },

  async get_portfolio(): Promise<ToolResult> {
    // Load portfolio from database
    // TODO: Implement database read
    
    return {
      success: true,
      data: {
        problems: [],
        risk: '',
        lastReviewed: null,
      },
    };
  },

  async get_active_bet(): Promise<ToolResult> {
    // Load current bet from database
    // TODO: Implement database read
    
    return {
      success: true,
      data: null, // or current bet
    };
  },

  async get_avoided_decisions(params: {
    status?: 'active' | 'resolved' | 'all';
  }): Promise<ToolResult> {
    // Load avoided decisions from database
    // TODO: Implement database read
    
    return {
      success: true,
      data: [],
    };
  },
};

// ============================================================================
// TOOL EXECUTOR
// ============================================================================

export async function executeTool(
  toolName: string,
  params: Record<string, any>
): Promise<ToolResult> {
  const handler = toolHandlers[toolName as keyof typeof toolHandlers];
  
  if (!handler) {
    return {
      success: false,
      error: `Unknown tool: ${toolName}`,
    };
  }
  
  try {
    return await handler(params);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    };
  }
}

// ============================================================================
// TOOL LIST FOR CLAUDE API
// ============================================================================

export const tools = Object.values(toolSchemas);

export default { toolSchemas, toolHandlers, executeTool, tools };
