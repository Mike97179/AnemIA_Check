import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

const steps = [
    {
        icon: '📷',
        title: 'Conjunctiva photo',
        desc: 'Capture the inner part of the child\'s lower eyelid',
    },
    {
        icon: '📋',
        title: 'Clinical questionnaire',
        desc: 'Answer questions about symptoms and diet',
    },
    {
        icon: '🤖',
        title: 'AI analysis',
        desc: 'MedGemma evaluates both inputs and estimates the risk',
    },
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { resetSession } = useAssessment();

    const handleStart = () => {
        resetSession();
        navigate('/assessment');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8) var(--space-6)',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px',
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-20px', left: '-20px',
                    width: '80px', height: '80px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                }} />
                <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-3)' }}>👁️</div>
                <h1 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 900,
                    lineHeight: 1.2,
                    marginBottom: 'var(--space-3)',
                }}>
                    Early detection of childhood anemia
                </h1>
                <p style={{
                    fontSize: 'var(--font-size-base)',
                    opacity: 0.88,
                    lineHeight: 1.6,
                    maxWidth: '340px',
                    margin: '0 auto var(--space-6)',
                }}>
                    An intelligent screening tool for caregivers and families,
                    using your camera and a clinical questionnaire.
                </p>
                <button className="btn" onClick={handleStart} style={{
                    background: 'white',
                    color: 'var(--color-primary)',
                    fontSize: 'var(--font-size-lg)',
                    padding: 'var(--space-4) var(--space-8)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}>
                    🔬 Start assessment
                </button>
            </div>

            {/* How it works */}
            <div>
                <div className="section-header">
                    <h2 className="section-title">How does it work?</h2>
                    <p className="section-subtitle">3 simple steps from your phone</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {steps.map((step, idx) => (
                        <div key={idx} className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '52px', height: '52px', flexShrink: 0,
                                background: 'var(--color-primary-bg)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.6rem',
                            }}>
                                {step.icon}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                                    <span style={{
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        width: '20px', height: '20px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
                                    }}>{idx + 1}</span>
                                    <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {step.title}
                                    </p>
                                </div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="section-title" style={{ marginBottom: 'var(--space-3)' }}>Quick access</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <button
                        className="card"
                        onClick={handleStart}
                        style={{
                            border: '2px solid var(--color-primary)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            background: 'var(--color-primary-bg)',
                            padding: 'var(--space-5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>🔬</span>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
                            New assessment
                        </span>
                    </button>
                    <button
                        className="card"
                        onClick={() => navigate('/consejos')}
                        style={{
                            border: '2px solid var(--color-border)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: 'var(--space-5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>📚</span>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
                            Tips & suggestions
                        </span>
                    </button>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="disclaimer">
                ⚕️ <strong>Medical notice:</strong> This tool is for screening purposes only.
                It does not replace a professional diagnosis.
                If you have any concerns, please consult a doctor.
            </div>

        </div>
    );
};

export default Home;
