'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCareerBoardStore } from '@/lib/store';
import { Button } from './ui/Button';
import { X, Send, Loader2, Paperclip, Calendar, Search } from 'lucide-react';

export default function Chat() {
    const {
        messages,
        currentSession,
        isLoading,
        toggleChat,
        endSession,
        addMessage,
        setLoading
    } = useCareerBoardStore();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const sessionTitles = {
        quick_audit: 'Quick Audit',
        setup: 'Setup Portfolio',
        quarterly: 'Quarterly Review',
        weekly: 'Weekly Pulse',
    };

    const getInitialMessage = () => {
        switch (currentSession) {
            case 'quick_audit':
                return "Let's do a 15-minute career audit. Before we start—any sensitive details you'd prefer to abstract or keep private? If not, we can proceed.";
            case 'setup':
                return "I'll help you set up your Problem Portfolio and Board Roles. This usually takes 30-45 minutes. Any sensitive details you'd like to abstract before we begin?";
            case 'quarterly':
                return "Time for your quarterly board meeting. I'll ask about last quarter's bet, your receipts, avoided decisions, and set a new prediction. Ready to start?";
            case 'weekly':
                return "Weekly pulse check. I have 3 quick questions:\n\n1. **Receipts**: What artifact or decision did you ship this week?\n2. **Avoidance**: Any movement on tracked decisions?\n3. **Bet evidence**: Anything supporting or contradicting your current prediction?";
            default:
                return "Hi! I'm your Career Board assistant. How can I help today?";
        }
    };

    useEffect(() => {
        // Add initial message when session starts
        if (currentSession && messages.length === 0) {
            addMessage({
                role: 'assistant',
                content: getInitialMessage(),
            });
        }
    }, [currentSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        addMessage({ role: 'user', content: userMessage });
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }],
                    sessionType: currentSession,
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            addMessage({ role: 'assistant', content: data.content });
        } catch (error) {
            addMessage({
                role: 'assistant',
                content: "I apologize, but I'm having trouble connecting right now. Please check your API key configuration and try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-3xl h-[80vh] mx-4 bg-card rounded-2xl border border-border shadow-2xl flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {currentSession ? sessionTitles[currentSession] : 'Chat'}
                        </h2>
                        <p className="text-xs text-muted-foreground">Career Board Assistant</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={endSession}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-md'
                                        : 'bg-secondary text-foreground rounded-bl-md'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your response..."
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <div className="flex items-center gap-2 mt-3">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Paperclip className="w-4 h-4 mr-2" />
                            Upload Evidence
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            Check Calendar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Search className="w-4 h-4 mr-2" />
                            Search Docs
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
