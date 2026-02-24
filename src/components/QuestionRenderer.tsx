// ============================================================
// QuestionRenderer — Dynamic question renderer
// Renders any question type returned by the backend API.
// Adding a new question type only requires adding a new case here.
// ============================================================

import React from 'react';
import type { Question } from '../types';

interface Props {
    question: Question;
    value: string | boolean | number | string[] | undefined;
    onChange: (val: string | boolean | number | string[]) => void;
}

const QuestionRenderer: React.FC<Props> = ({ question, value, onChange }) => {
    const { type, options, min = 1, max = 5 } = question;

    // ---- yes_no ----
    if (type === 'yes_no') {
        return (
            <div className="yes-no-group">
                {[
                    { label: 'Yes', icon: '✅', val: true },
                    { label: 'No', icon: '❌', val: false },
                ].map((opt) => (
                    <button
                        key={String(opt.val)}
                        className={`choice-btn${value === opt.val ? ' selected' : ''}`}
                        onClick={() => onChange(opt.val)}
                        type="button"
                    >
                        <span className="choice-btn-icon">{opt.icon}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        );
    }

    // ---- multiple_choice ----
    if (type === 'multiple_choice') {
        const selected = Array.isArray(value) ? (value as string[]) : [];
        const toggle = (opt: string) => {
            const next = selected.includes(opt)
                ? selected.filter((s) => s !== opt)
                : [...selected, opt];
            onChange(next);
        };
        return (
            <div className="chips-group">
                {(options ?? []).map((opt) => (
                    <button
                        key={opt}
                        className={`chip${selected.includes(opt) ? ' selected' : ''}`}
                        onClick={() => toggle(opt)}
                        type="button"
                    >
                        {selected.includes(opt) ? '✓ ' : ''}{opt}
                    </button>
                ))}
            </div>
        );
    }

    // ---- scale ----
    if (type === 'scale') {
        const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        return (
            <div className="scale-group">
                <div className="scale-options">
                    {nums.map((n) => (
                        <button
                            key={n}
                            className={`scale-btn${value === n ? ' selected' : ''}`}
                            onClick={() => onChange(n)}
                            type="button"
                        >
                            {n}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Very low</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Very high</span>
                </div>
            </div>
        );
    }

    // ---- number ----
    if (type === 'number') {
        return (
            <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <input
                        className="form-input"
                        type="number"
                        inputMode="numeric"
                        min={min}
                        max={max}
                        value={value !== undefined ? String(value) : ''}
                        onChange={(e) => {
                            const n = parseInt(e.target.value, 10);
                            if (!isNaN(n)) onChange(n);
                        }}
                        placeholder={`${min} – ${max}`}
                        style={{ flex: 1 }}
                    />
                    {question.unit && (
                        <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)', minWidth: '40px' }}>
                            {question.unit}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // ---- text (fallback) ----
    return (
        <div className="form-group">
            <textarea
                className="form-input"
                rows={3}
                value={value !== undefined ? String(value) : ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your answer..."
                style={{ resize: 'none', fontFamily: 'var(--font)' }}
            />
        </div>
    );
};

export default QuestionRenderer;
