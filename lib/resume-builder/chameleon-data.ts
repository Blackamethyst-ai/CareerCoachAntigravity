export const CHAMELEON_PROMPTS = {
    speed: {
        keyword: "speed",
        focus: "Removing friction, automation, velocity, immediate impact, anti-bureaucracy.",
        rewriteRule: "Convert 'managed' to 'accelerated'. Convert 'process' to 'system'. Focus on time-saved and velocity metrics."
    },
    safety: {
        keyword: "safety",
        focus: "Reliability, governance, audit trails, risk mitigation, stable scaling.",
        rewriteRule: "Convert 'fast' to 'reliable'. Convert 'built' to 'secured'. Focus on accuracy, up-time, and compliance metrics."
    },
    ecosystem: {
        keyword: "ecosystem",
        focus: "Network effects, partnerships, integrations, platform leverage, community.",
        rewriteRule: "Convert 'individual' metrics to 'network' metrics. Focus on 'attachment rates', 'partner influence', and 'joint value'."
    },
    creative: {
        keyword: "creative",
        focus: "Innovation, zero-to-one, prototyping, bridging research to product, novelty.",
        rewriteRule: "Convert 'optimized' to 'invented'. Focus on 'first-of-kind', 'prototypes', and 'novel architectures'."
    },
    general: {
        keyword: "general",
        focus: "Competence, results, impact.",
        rewriteRule: "Standard STAR method."
    }
};

export const SAMPLE_METRICS = [
    {
        id: "m1",
        original: "Managed $800M in registered deal value.",
        speed: "Removed friction from an $800M revenue pipe, accelerating deal velocity.",
        safety: "Ensured governance and auditability for $800M in sensitive transaction volume.",
        ecosystem: "Architected the partner ecosystem handling $800M in cross-cloud flow.",
        creative: "Designed the deal-flow architecture that processed $800M in value."
    },
    {
        id: "m2",
        original: "Reduced deal registration time by 50% through CRM automation.",
        speed: " slashed 50% of manual drag from deal reg using aggressive automation.",
        safety: "Automated deal reg to eliminate human error, reducing risk and time by 50%.",
        ecosystem: "Streamlined partner access, boosting ecosystem throughput by 50%.",
        creative: "Invented a novel CRM automation workflow that cut registration time in half."
    }
];
