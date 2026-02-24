import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { getEducationContent } from '../data/educationContent';
import type { RiskLevel, EducationSection } from '../types';

const Education: React.FC = () => {
    const location = useLocation();
    const { riskLevel: sessionRisk } = useAssessment();

    // Accept risk level from route state (from Results page) or from session
    const riskLevel: RiskLevel = (location.state as { riskLevel?: RiskLevel })?.riskLevel
        ?? sessionRisk
        ?? 'low'; // default for direct access

    const [expanded, setExpanded] = useState<string | null>(null);
    const [sections, setSections] = useState<EducationSection[]>([]);

    useEffect(() => {
        // TODO: Replace with real API call: GET /api/education?riskLevel=<riskLevel>
        const content = getEducationContent(riskLevel);
        setSections(content.sections);
        if (content.sections.length > 0) setExpanded(content.sections[0].id);
    }, [riskLevel]);

    const RISK_LABEL: Record<RiskLevel, string> = {
        low: '🟢 Low Risk',
        medium: '🟡 Moderate Risk',
        high: '🔴 High Risk',
    };

    const RISK_BG: Record<RiskLevel, string> = {
        low: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)',
        medium: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
        high: 'linear-gradient(135deg, #FEE2E2, #FFF5F5)',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* Header */}
            <div style={{
                background: RISK_BG[riskLevel],
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
            }}>
                <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, marginBottom: 'var(--space-1)' }}>
                    Tips & Suggestions
                </h1>
                {sessionRisk || location.state ? (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        Content tailored to: <strong>{RISK_LABEL[riskLevel]}</strong>
                    </p>
                ) : (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        General information about childhood anemia
                    </p>
                )}
            </div>

            {/* Accordion sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {sections.map((section) => {
                    const isOpen = expanded === section.id;
                    return (
                        <div
                            key={section.id}
                            className="card"
                            style={{
                                padding: 0,
                                overflow: 'hidden',
                                border: isOpen ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                transition: 'border-color 0.2s ease',
                            }}
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpanded(isOpen ? null : section.id)}
                                style={{
                                    width: '100%',
                                    background: isOpen ? 'var(--color-primary-bg)' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 'var(--space-4) var(--space-5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    textAlign: 'left',
                                    transition: 'background 0.2s ease',
                                    minHeight: '64px',
                                }}
                            >
                                <span style={{
                                    width: '44px', height: '44px', flexShrink: 0,
                                    background: isOpen ? 'var(--color-primary)' : 'var(--color-primary-bg)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem',
                                    transition: 'background 0.2s ease',
                                }}>
                                    {section.icon}
                                </span>
                                <span style={{
                                    flex: 1,
                                    fontFamily: 'var(--font)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 700,
                                    color: isOpen ? 'var(--color-primary)' : 'var(--color-text)',
                                }}>
                                    {section.title}
                                </span>
                                <span style={{
                                    fontSize: '1rem',
                                    color: 'var(--color-text-muted)',
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                }}>
                                    ▾
                                </span>
                            </button>

                            {/* Content */}
                            {isOpen && (
                                <div style={{
                                    padding: 'var(--space-4) var(--space-5) var(--space-5)',
                                    borderTop: '1px solid var(--color-border)',
                                }}>
                                    <p style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text)',
                                        lineHeight: 1.8,
                                    }}>
                                        {section.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Risk level selector for direct access without assessment */}
            {!sessionRisk && !location.state && (
                <div className="card">
                    <p style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                        VIEW CONTENT BY RISK LEVEL
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['low', 'medium', 'high'] as RiskLevel[]).map((level) => (
                            <a
                                key={level}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSections(getEducationContent(level).sections); }}
                                style={{
                                    flex: 1,
                                    padding: 'var(--space-2)',
                                    textAlign: 'center',
                                    borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${level === 'low' ? 'var(--color-low)' : level === 'medium' ? 'var(--color-medium)' : 'var(--color-high)'}`,
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: 'var(--font-size-xs)',
                                    color: level === 'low' ? 'var(--color-low-text)' : level === 'medium' ? 'var(--color-medium-text)' : 'var(--color-high-text)',
                                }}
                            >
                                {level === 'low' ? '🟢 Low' : level === 'medium' ? '🟡 Medium' : '🔴 High'}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="disclaimer">
                📖 This information is educational and preventive. Always consult a healthcare professional if you have concerns or notice symptoms.
            </div>
        </div>
    );
};

export default Education;
