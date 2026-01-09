'use client';

import React, { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Panel,
    Node,
    Edge,
    Handle,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Component
const CareerNode = ({ data }: { data: any }) => {
    return (
        <div className="skill-node">
            <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
            <div className="node-label">{data.type}</div>
            <div className="node-title">{data.label}</div>
            {data.subtitle && <div className="node-subtitle">{data.subtitle}</div>}
            <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
        </div>
    );
};

const nodeTypes = {
    career: CareerNode,
};

const initialNodes: Node[] = [
    {
        id: 'user-1',
        type: 'career',
        position: { x: 50, y: 200 },
        data: { label: 'Dico Angelo', type: 'User' },
    },
    {
        id: 'pos-1',
        type: 'career',
        position: { x: 300, y: 100 },
        data: { label: 'AI Platform Lead', type: 'Position', subtitle: 'Strategic Planning' },
    },
    {
        id: 'comp-1',
        type: 'career',
        position: { x: 550, y: 100 },
        data: { label: 'Anthropic', type: 'Company', subtitle: 'San Francisco, CA' },
    },
    {
        id: 'pos-2',
        type: 'career',
        position: { x: 300, y: 300 },
        data: { label: 'Senior Agentic Engineer', type: 'Position', subtitle: 'Implementation' },
    },
    {
        id: 'comp-2',
        type: 'career',
        position: { x: 550, y: 300 },
        data: { label: 'DeepMind', type: 'Company', subtitle: 'London, UK' },
    }
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'user-1', target: 'pos-1', animated: true, style: { stroke: '#89b4fa' } },
    { id: 'e2', source: 'pos-1', target: 'comp-1', style: { stroke: '#f5c2e7' } },
    { id: 'e3', source: 'user-1', target: 'pos-2', animated: true, style: { stroke: '#89b4fa' } },
    { id: 'e4', source: 'pos-2', target: 'comp-2', style: { stroke: '#fab387' } },
];

export default function SkillGraphCanvas() {
    return (
        <div className="skill-graph-container">
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#313244" gap={20} />
                <Controls showInteractive={false} />
                <Panel position="top-right" style={{ color: '#cdd6f4', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
                    <strong>Ternary Relationship Explorer</strong><br />
                    (User &rarr; Position &rarr; Company)
                </Panel>
            </ReactFlow>
        </div>
    );
}
