import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { uploadImage, submitAssessment } from '../services/assessmentService';
import type { Question, Answer } from '../types';
import QuestionRenderer from '../components/QuestionRenderer';

type Stage = 'photo' | 'uploading' | 'invalid_image' | 'triage' | 'analyzing';

const Assessment: React.FC = () => {
    const navigate = useNavigate();
    const { session, setSessionId, setImageUploaded, setAnswers, setResult } = useAssessment();

    const [stage, setStage] = useState<Stage>('photo');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setLocalAnswers] = useState<Answer[]>([]);
    const [error, setError] = useState('');
    const [invalidImageMsg, setInvalidImageMsg] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // -------- Photo stage --------
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');
        setInvalidImageMsg('');
        setStage('uploading');
        const previewUrl = URL.createObjectURL(file);
        try {
            const result = await uploadImage(file);
            setSessionId(result.sessionId);
            setImageUploaded(file, previewUrl);

            if (!result.imageValid) {
                setInvalidImageMsg(result.validationMessage || 'The image does not appear to be a conjunctiva photo.');
                setQuestions(result.questions || []);
                setStage('invalid_image');
                return;
            }

            if (result.questions && result.questions.length > 0) {
                setQuestions(result.questions);
                setStage('triage');
            } else {
                setError('No questions were generated. Please try uploading a different image.');
                setStage('photo');
            }
        } catch {
            setError('There was an error uploading the image. Please try again.');
            setStage('photo');
        }
    };

    const handleContinueAnyway = () => {
        setInvalidImageMsg('');
        if (questions.length > 0) {
            setStage('triage');
        } else {
            setError('No questions available. Please try uploading a different image.');
            setStage('photo');
        }
    };

    const handleRetakePhoto = () => {
        setInvalidImageMsg('');
        setStage('photo');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // -------- Triage stage --------
    const handleAnswer = (questionId: string, value: Answer['value']) => {
        setLocalAnswers((prev) => {
            const filtered = prev.filter((a) => a.questionId !== questionId);
            return [...filtered, { questionId, value }];
        });
    };

    const currentAnswer = answers.find((a) => a.questionId === questions[currentQ]?.id);

    const canProceed = () => {
        const q = questions[currentQ];
        if (!q) return false;
        if (!q.required && !currentAnswer) return true;
        return !!currentAnswer;
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ((p) => p + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentQ > 0) setCurrentQ((p) => p - 1);
        else setStage('photo');
    };

    const handleSubmit = async () => {
        setStage('analyzing');
        setAnswers(answers);
        try {
            const result = await submitAssessment(session.sessionId, answers);
            setResult(result);
            navigate('/results');
        } catch {
            setError('Error processing the assessment. Please try again.');
            setStage('triage');
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

    if (stage === 'uploading') {
        return (
            <div className="spinner-overlay" style={{ height: '60vh' }}>
                <div style={{ fontSize: '3rem', animation: 'pulse 1.5s ease-in-out infinite' }}>📷</div>
                <div className="spinner" />
                <p className="spinner-text">Uploading and validating image with AI...</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                    MedGemma validates the image and generates the questions
                </p>
            </div>
        );
    }

    if (stage === 'invalid_image') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{
                    background: 'var(--color-high-bg)',
                    border: '2px solid var(--color-high)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>⚠️</div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-high-text)', marginBottom: 'var(--space-3)' }}>
                        Invalid image
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                        {invalidImageMsg}
                    </p>
                </div>

                {session.imagePreviewUrl && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                        <img
                            src={session.imagePreviewUrl}
                            alt="Uploaded image"
                            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', opacity: 0.7 }}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <button
                        className="btn btn-primary btn-full"
                        onClick={handleRetakePhoto}
                    >
                        📷 Take another photo
                    </button>
                    <button
                        className="btn btn-secondary btn-full"
                        onClick={handleContinueAnyway}
                    >
                        Continue anyway →
                    </button>
                </div>

                <div className="disclaimer">
                    If you cannot take a conjunctiva photo, you can continue with the clinical questionnaire only.
                </div>
            </div>
        );
    }

    if (stage === 'analyzing') {
        return (
            <div className="spinner-overlay" style={{ height: '60vh' }}>
                <div style={{ fontSize: '3rem' }}>🤖</div>
                <div className="spinner" />
                <p className="spinner-text">
                    MedGemma is analyzing the image<br />and the reported symptoms...
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                    This may take a few seconds
                </p>
            </div>
        );
    }

    if (stage === 'photo') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                {/* Session info banner */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary-bg), white)',
                    border: '1px solid rgba(37,99,168,0.15)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                }}>
                    <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
                        Step 1 of 2 — Conjunctiva photo
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        Capture the inner part of the child's lower eyelid.
                        The image and questionnaire answers will be analyzed together.
                    </p>
                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary)' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)' }} />
                    </div>
                </div>

                {/* Guide card */}
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                    {session.imagePreviewUrl ? (
                        <>
                            <img
                                src={session.imagePreviewUrl}
                                alt="Captured image"
                                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}
                            />
                            <p style={{ fontWeight: 700, color: 'var(--color-low-text)', marginBottom: 'var(--space-3)' }}>
                                ✅ Image ready
                            </p>
                        </>
                    ) : (
                        <>
                            <div style={{
                                width: '100%', height: '180px',
                                background: 'var(--color-primary-bg)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                border: '2px dashed var(--color-primary)',
                                gap: 'var(--space-2)',
                            }}>
                                <span style={{ fontSize: '3rem' }}>👁️</span>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
                                    Capture area
                                </p>
                            </div>

                            {/* Guide steps */}
                            <div style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>
                                {[
                                    '💡 Find good natural lighting',
                                    '👁️ Gently pull the lower eyelid downward',
                                    '📷 Take a close-up photo, no flash',
                                    '✅ Make sure the pink inner area is clearly visible',
                                ].map((tip, i) => (
                                    <p key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0' }}>
                                        {tip}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <button
                        className="btn btn-primary btn-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {session.imagePreviewUrl ? '🔄 Change photo' : '📷 Take conjunctiva photo'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        background: 'var(--color-high-bg)', color: 'var(--color-high-text)',
                        padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)', fontWeight: 600,
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="disclaimer">
                    The image is securely processed and used solely for this analysis.
                </div>
            </div>
        );
    }

    // Stage: triage
    const progress = ((currentQ) / questions.length) * 100;
    const q = questions[currentQ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* Header info */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800 }}>Step 2 of 2 — Questionnaire</h1>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            Question {currentQ + 1} of {questions.length}
                        </p>
                    </div>
                    {session.imagePreviewUrl && (
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden', border: '2px solid var(--color-primary)',
                            flexShrink: 0,
                        }}>
                            <img src={session.imagePreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
                {/* Progress bar */}
                <div className="progress-bar-wrapper">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                {/* Step dots */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-low)' }} />
                    <div style={{ width: '24px', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary)' }} />
                </div>
            </div>

            {/* Question card */}
            {q && (
                <div className="card card-elevated" style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, lineHeight: 1.4, marginBottom: 'var(--space-2)' }}>
                        {q.text}
                    </p>
                    {q.hint && (
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
                            {q.hint}
                        </p>
                    )}
                    <QuestionRenderer
                        question={q}
                        value={currentAnswer?.value}
                        onChange={(val: Answer['value']) => handleAnswer(q.id, val)}
                    />
                </div>
            )}

            {error && (
                <div style={{
                    background: 'var(--color-high-bg)', color: 'var(--color-high-text)',
                    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)', fontWeight: 600,
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn-ghost" onClick={handleBack} style={{ minWidth: '90px' }}>
                    ← Back
                </button>
                <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleNext}
                    disabled={!canProceed()}
                >
                    {currentQ < questions.length - 1 ? 'Next →' : '🤖 Analyze with AI'}
                </button>
            </div>

            <div className="disclaimer">
                ⚕️ Your answers and image are analyzed together by the AI model.
            </div>
        </div>
    );
};

export default Assessment;
