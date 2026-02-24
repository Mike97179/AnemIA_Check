import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import type { RiskLevel } from '../types';

/** Sanitize explanation text: remove model artifacts that might slip through from the backend. */
function sanitizeExplanation(text: string): string {
    if (!text || typeof text !== 'string') return '';
    let s = text.trim();
    s = s.replace(/<unused94>\s*thought[^.]*\.?/gi, '');
    s = s.replace(/<[^>]+>thought[^.]*\.?/gi, '');
    s = s.replace(/\*\*[^*]*\*\*:?\s?/g, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; emoji: string; color: string; bg: string; textColor: string }> = {
    low: {
        label: 'Low Risk',
        emoji: '🟢',
        color: 'var(--color-low)',
        bg: 'var(--color-low-bg)',
        textColor: 'var(--color-low-text)',
    },
    medium: {
        label: 'Moderate Risk',
        emoji: '🟡',
        color: 'var(--color-medium)',
        bg: 'var(--color-medium-bg)',
        textColor: 'var(--color-medium-text)',
    },
    high: {
        label: 'High Risk',
        emoji: '🔴',
        color: 'var(--color-high)',
        bg: 'var(--color-high-bg)',
        textColor: 'var(--color-high-text)',
    },
};

const Results: React.FC = () => {
    const navigate = useNavigate();
    const { session, resetSession } = useAssessment();
    const result = session.result;

    // No result yet — redirect prompt
    if (!result) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)' }}>
                <span style={{ fontSize: '3rem' }}>📊</span>
                <h2 style={{ fontWeight: 800 }}>No results yet</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Complete the full assessment first to see your results here.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/assessment')}>
                    🔬 Go to assessment
                </button>
            </div>
        );
    }

    const cfg = RISK_CONFIG[result.riskLevel];
    const explanationDisplay = sanitizeExplanation(result.explanation) || result.explanation;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'AnemiaCheck Result',
                text: `Screening result: ${cfg.label}. ${explanationDisplay.slice(0, 100)}...`,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(`AnemiaCheck — ${cfg.label}\n${explanationDisplay}`);
        }
    };

    const handleNewAssessment = () => {
        resetSession();
        navigate('/assessment');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* Risk level hero */}
            <div style={{
                background: cfg.bg,
                border: `2px solid ${cfg.color}`,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)' }}>{cfg.emoji}</div>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: cfg.textColor, marginBottom: 'var(--space-3)' }}>
                    {cfg.label}
                </h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                    {explanationDisplay.split(/\n\n+/).map((para, i) => (
                        <span key={i}>
                            {i > 0 && <><br /><br /></>}
                            {para}
                        </span>
                    ))}
                </p>
            </div>

            {/* Recommendations */}
            <div className="card">
                <p style={{ fontWeight: 700, marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    WHAT TO DO NOW?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {result.recommendations.map((rec, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '24px', height: '24px', flexShrink: 0,
                                background: 'var(--color-primary-bg)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-primary)',
                            }}>
                                {idx + 1}
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6, color: 'var(--color-text)', paddingTop: '2px' }}>
                                {rec}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button
                    className="btn btn-primary btn-full"
                    onClick={() => navigate('/consejos', { state: { riskLevel: result.riskLevel } })}
                >
                    💡 View tips & suggestions
                </button>
                <button
                    className="btn btn-secondary btn-full"
                    onClick={handleShare}
                >
                    📤 Share result
                </button>
                <a
                    href="https://www.google.com/maps/search/centro+de+salud/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-full"
                >
                    🏥 Find a nearby health center
                </a>
                <button
                    className="btn btn-ghost btn-full"
                    style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}
                    onClick={handleNewAssessment}
                >
                    🔄 New assessment
                </button>
            </div>

            <div className="disclaimer">
                ⚕️ This result is for screening purposes only. A laboratory hemoglobin test is required for a definitive diagnosis.
            </div>
        </div>
    );
};

export default Results;
