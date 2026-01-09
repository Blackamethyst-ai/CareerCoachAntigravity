/**
 * Question Generator
 * Generates AI interview-style questions for skill assessment
 */

import { Question, QuestionType, QuestionBank, ResponsePattern } from './types';

// ============================================================================
// QUESTION TEMPLATES BY CATEGORY
// ============================================================================

const EXPERIENCE_PROBING_TEMPLATES = [
    "Tell me about your experience with {skill}.",
    "How long have you been working with {skill}?",
    "What projects have you used {skill} in?",
    "Describe a situation where you had to use {skill} extensively.",
    "Walk me through your journey of learning {skill}.",
];

const PRACTICAL_APPLICATION_TEMPLATES = [
    "Can you give me a specific example of how you applied {skill} in a real project?",
    "Tell me about a time when {skill} was critical to solving a problem.",
    "How have you used {skill} to improve a process or system?",
    "Describe the most complex implementation you've done with {skill}.",
    "What was the business impact of your work with {skill}?",
];

const PROBLEM_SOLVING_TEMPLATES = [
    "How would you approach {scenario} using {skill}?",
    "If you encountered {problem}, how would you use {skill} to solve it?",
    "Walk me through your thought process for optimizing {aspect} with {skill}.",
    "What factors would you consider when implementing {feature} with {skill}?",
    "How would you debug {issue} in a {skill} application?",
];

const FOLLOW_UP_TEMPLATES = [
    "Can you go deeper on that? What specific steps did you take?",
    "What challenges did you face and how did you overcome them?",
    "If you had to do it again, what would you do differently?",
    "How did you measure success?",
    "What did you learn from that experience?",
    "How did that decision impact the team or project?",
    "Can you walk me through the technical details?",
];

// ============================================================================
// SKILL-SPECIFIC QUESTION BANKS
// ============================================================================

const SKILL_QUESTIONS: Record<string, Partial<QuestionBank>> = {
    react: {
        skill: 'React',
        category: 'frontend',
        questions: {
            experienceProbing: [
                {
                    id: 'react-exp-1',
                    text: "Tell me about your experience with React. How long have you been using it?",
                    type: 'experience-probing',
                    skill: 'react',
                    difficulty: 'junior',
                    expectedElements: ['years of experience', 'types of projects', 'components built'],
                },
                {
                    id: 'react-exp-2',
                    text: "What's the most complex React application you've built?",
                    type: 'experience-probing',
                    skill: 'react',
                    difficulty: 'mid',
                    expectedElements: ['scale', 'architecture decisions', 'state management'],
                },
            ],
            practicalApplication: [
                {
                    id: 'react-app-1',
                    text: "Walk me through how you've managed state in a React application. What approaches have you used?",
                    type: 'practical-application',
                    skill: 'react',
                    difficulty: 'mid',
                    expectedElements: ['useState', 'useReducer', 'Context', 'Redux/Zustand', 'when to use each'],
                },
                {
                    id: 'react-app-2',
                    text: "How have you handled performance optimization in React?",
                    type: 'practical-application',
                    skill: 'react',
                    difficulty: 'senior',
                    expectedElements: ['React.memo', 'useMemo', 'useCallback', 'code splitting', 'profiling'],
                },
            ],
            problemSolving: [
                {
                    id: 'react-ps-1',
                    text: "You notice a React component is re-rendering too frequently. How would you debug and fix this?",
                    type: 'problem-solving',
                    skill: 'react',
                    difficulty: 'mid',
                    expectedElements: ['React DevTools', 'profiler', 'dependency arrays', 'memoization'],
                },
                {
                    id: 'react-ps-2',
                    text: "Design a component architecture for a dashboard with real-time updates. What would you consider?",
                    type: 'problem-solving',
                    skill: 'react',
                    difficulty: 'senior',
                    expectedElements: ['component hierarchy', 'state management', 'WebSocket/SSE', 'error boundaries'],
                },
            ],
        },
    },

    javascript: {
        skill: 'JavaScript',
        category: 'frontend',
        questions: {
            experienceProbing: [
                {
                    id: 'js-exp-1',
                    text: "Tell me about your JavaScript background. How would you rate your proficiency?",
                    type: 'experience-probing',
                    skill: 'javascript',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'js-app-1',
                    text: "Explain how you've used async/await and Promises in your projects.",
                    type: 'practical-application',
                    skill: 'javascript',
                    difficulty: 'mid',
                    expectedElements: ['Promise chaining', 'error handling', 'parallel execution', 'real example'],
                },
            ],
            problemSolving: [
                {
                    id: 'js-ps-1',
                    text: "You have an API that sometimes returns slowly. How would you implement a timeout and retry mechanism?",
                    type: 'problem-solving',
                    skill: 'javascript',
                    difficulty: 'mid',
                },
            ],
        },
    },

    typescript: {
        skill: 'TypeScript',
        category: 'frontend',
        questions: {
            experienceProbing: [
                {
                    id: 'ts-exp-1',
                    text: "How has TypeScript changed the way you write code?",
                    type: 'experience-probing',
                    skill: 'typescript',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'ts-app-1',
                    text: "Give me an example of how you've used generics in TypeScript.",
                    type: 'practical-application',
                    skill: 'typescript',
                    difficulty: 'mid',
                },
            ],
            problemSolving: [
                {
                    id: 'ts-ps-1',
                    text: "How would you type a function that can accept different shapes of input and return corresponding outputs?",
                    type: 'problem-solving',
                    skill: 'typescript',
                    difficulty: 'senior',
                },
            ],
        },
    },

    python: {
        skill: 'Python',
        category: 'backend',
        questions: {
            experienceProbing: [
                {
                    id: 'py-exp-1',
                    text: "What types of applications have you built with Python?",
                    type: 'experience-probing',
                    skill: 'python',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'py-app-1',
                    text: "How have you used Python for data processing or automation?",
                    type: 'practical-application',
                    skill: 'python',
                    difficulty: 'mid',
                },
            ],
            problemSolving: [
                {
                    id: 'py-ps-1',
                    text: "Design a Python script to process and analyze a large dataset efficiently.",
                    type: 'problem-solving',
                    skill: 'python',
                    difficulty: 'senior',
                },
            ],
        },
    },

    aws: {
        skill: 'AWS',
        category: 'cloud',
        questions: {
            experienceProbing: [
                {
                    id: 'aws-exp-1',
                    text: "Which AWS services have you worked with? Give me an overview of your experience.",
                    type: 'experience-probing',
                    skill: 'aws',
                    difficulty: 'junior',
                    expectedElements: ['specific services', 'use cases', 'certifications'],
                },
            ],
            practicalApplication: [
                {
                    id: 'aws-app-1',
                    text: "Describe an architecture you've designed or implemented on AWS.",
                    type: 'practical-application',
                    skill: 'aws',
                    difficulty: 'mid',
                    expectedElements: ['services used', 'why those services', 'scalability', 'cost considerations'],
                },
            ],
            problemSolving: [
                {
                    id: 'aws-ps-1',
                    text: "How would you design a highly available, scalable web application on AWS?",
                    type: 'problem-solving',
                    skill: 'aws',
                    difficulty: 'senior',
                },
            ],
        },
    },

    salesforce: {
        skill: 'Salesforce',
        category: 'crm',
        questions: {
            experienceProbing: [
                {
                    id: 'sf-exp-1',
                    text: "Tell me about your Salesforce experience. What aspects have you worked with?",
                    type: 'experience-probing',
                    skill: 'salesforce',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'sf-app-1',
                    text: "Describe a Salesforce integration or automation you've implemented.",
                    type: 'practical-application',
                    skill: 'salesforce',
                    difficulty: 'mid',
                },
            ],
            problemSolving: [
                {
                    id: 'sf-ps-1',
                    text: "How would you design a data governance strategy for a Salesforce org with multiple business units?",
                    type: 'problem-solving',
                    skill: 'salesforce',
                    difficulty: 'senior',
                },
            ],
        },
    },

    'partner operations': {
        skill: 'Partner Operations',
        category: 'gtm',
        questions: {
            experienceProbing: [
                {
                    id: 'partnerops-exp-1',
                    text: "Tell me about your experience managing partner programs and operations.",
                    type: 'experience-probing',
                    skill: 'partner operations',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'partnerops-app-1',
                    text: "Describe how you've optimized a partner deal registration process.",
                    type: 'practical-application',
                    skill: 'partner operations',
                    difficulty: 'mid',
                    expectedElements: ['process improvement', 'tools used', 'metrics improved'],
                },
            ],
            problemSolving: [
                {
                    id: 'partnerops-ps-1',
                    text: "How would you design a partner tier system that incentivizes the right behaviors?",
                    type: 'problem-solving',
                    skill: 'partner operations',
                    difficulty: 'senior',
                },
            ],
        },
    },

    'technical program management': {
        skill: 'Technical Program Management',
        category: 'pm',
        questions: {
            experienceProbing: [
                {
                    id: 'tpm-exp-1',
                    text: "What's your background in technical program management?",
                    type: 'experience-probing',
                    skill: 'technical program management',
                    difficulty: 'junior',
                },
            ],
            practicalApplication: [
                {
                    id: 'tpm-app-1',
                    text: "Describe a complex cross-functional program you've managed.",
                    type: 'practical-application',
                    skill: 'technical program management',
                    difficulty: 'mid',
                    expectedElements: ['scope', 'stakeholders', 'challenges', 'outcome'],
                },
            ],
            problemSolving: [
                {
                    id: 'tpm-ps-1',
                    text: "You're managing a program with three teams that have conflicting priorities. How do you resolve this?",
                    type: 'problem-solving',
                    skill: 'technical program management',
                    difficulty: 'senior',
                },
            ],
        },
    },
};

// ============================================================================
// QUESTION GENERATION FUNCTIONS
// ============================================================================

/**
 * Get questions for a specific skill
 */
export function getQuestionsForSkill(
    skill: string,
    difficulty?: 'junior' | 'mid' | 'senior'
): Question[] {
    const skillLower = skill.toLowerCase();
    const bank = SKILL_QUESTIONS[skillLower];

    if (!bank || !bank.questions) {
        return generateGenericQuestions(skill);
    }

    const allQuestions = [
        ...(bank.questions.experienceProbing || []),
        ...(bank.questions.practicalApplication || []),
        ...(bank.questions.problemSolving || []),
    ];

    if (difficulty) {
        return allQuestions.filter(q => q.difficulty === difficulty);
    }

    return allQuestions;
}

/**
 * Generate generic questions for skills not in the bank
 */
function generateGenericQuestions(skill: string): Question[] {
    return [
        {
            id: `${skill}-generic-exp`,
            text: `Tell me about your experience with ${skill}.`,
            type: 'experience-probing',
            skill,
            difficulty: 'junior',
        },
        {
            id: `${skill}-generic-app`,
            text: `Give me a specific example of how you've applied ${skill} in a project.`,
            type: 'practical-application',
            skill,
            difficulty: 'mid',
        },
        {
            id: `${skill}-generic-ps`,
            text: `Walk me through how you would approach a complex problem using ${skill}.`,
            type: 'problem-solving',
            skill,
            difficulty: 'senior',
        },
    ];
}

/**
 * Generate a follow-up question based on response
 */
export function generateFollowUp(
    previousQuestion: Question,
    responseKeywords: string[]
): Question {
    // Select a contextual follow-up based on what was said
    const followUpOptions = [
        {
            id: `${previousQuestion.id}-fu-1`,
            text: "Can you go deeper on that? What specific steps did you take?",
            type: 'follow-up' as QuestionType,
            skill: previousQuestion.skill,
            difficulty: previousQuestion.difficulty,
        },
        {
            id: `${previousQuestion.id}-fu-2`,
            text: "What challenges did you face and how did you overcome them?",
            type: 'follow-up' as QuestionType,
            skill: previousQuestion.skill,
            difficulty: previousQuestion.difficulty,
        },
        {
            id: `${previousQuestion.id}-fu-3`,
            text: "How did you measure the success of that approach?",
            type: 'follow-up' as QuestionType,
            skill: previousQuestion.skill,
            difficulty: previousQuestion.difficulty,
        },
        {
            id: `${previousQuestion.id}-fu-4`,
            text: "If you had to do it again, what would you do differently?",
            type: 'follow-up' as QuestionType,
            skill: previousQuestion.skill,
            difficulty: previousQuestion.difficulty,
        },
    ];

    // Simple selection - could be made smarter based on response analysis
    const randomIndex = Math.floor(Math.random() * followUpOptions.length);
    return followUpOptions[randomIndex];
}

/**
 * Generate a complete interview question sequence for multiple skills
 */
export function generateInterviewSequence(
    skills: string[],
    questionsPerSkill: number = 3
): Question[] {
    const sequence: Question[] = [];

    skills.forEach(skill => {
        const skillQuestions = getQuestionsForSkill(skill);

        // Add in order: experience → application → problem-solving
        const expQuestions = skillQuestions.filter(q => q.type === 'experience-probing');
        const appQuestions = skillQuestions.filter(q => q.type === 'practical-application');
        const psQuestions = skillQuestions.filter(q => q.type === 'problem-solving');

        if (expQuestions.length > 0) sequence.push(expQuestions[0]);
        if (appQuestions.length > 0 && questionsPerSkill > 1) sequence.push(appQuestions[0]);
        if (psQuestions.length > 0 && questionsPerSkill > 2) sequence.push(psQuestions[0]);
    });

    return sequence;
}

/**
 * Get all available skills that have question banks
 */
export function getAvailableSkills(): string[] {
    return Object.keys(SKILL_QUESTIONS);
}

/**
 * Get question bank for a skill
 */
export function getQuestionBank(skill: string): Partial<QuestionBank> | undefined {
    return SKILL_QUESTIONS[skill.toLowerCase()];
}
