// ============================================================
// AnemiaCheck — Assessment Context
// Global state for the unified assessment session (image + triage).
// sessionId is created when the image is uploaded and travels
// through the entire flow until the final result is obtained.
// ============================================================

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AssessmentSession, AssessmentResult, Answer, RiskLevel } from '../types';

interface AssessmentContextValue {
    session: AssessmentSession;
    setSessionId: (id: string) => void;
    setImageUploaded: (file: File, previewUrl: string) => void;
    setAnswers: (answers: Answer[]) => void;
    setResult: (result: AssessmentResult) => void;
    resetSession: () => void;
    // Convenience
    riskLevel: RiskLevel | null;
}

const defaultSession: AssessmentSession = {
    sessionId: '',
    imageUploaded: false,
    answers: [],
};

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<AssessmentSession>(defaultSession);

    const setSessionId = (id: string) =>
        setSession((prev) => ({ ...prev, sessionId: id }));

    const setImageUploaded = (file: File, previewUrl: string) =>
        setSession((prev) => ({
            ...prev,
            imageUploaded: true,
            imageFile: file,
            imagePreviewUrl: previewUrl,
        }));

    const setAnswers = (answers: Answer[]) =>
        setSession((prev) => ({ ...prev, answers }));

    const setResult = (result: AssessmentResult) =>
        setSession((prev) => ({ ...prev, result }));

    const resetSession = () => setSession(defaultSession);

    return (
        <AssessmentContext.Provider
            value={{
                session,
                setSessionId,
                setImageUploaded,
                setAnswers,
                setResult,
                resetSession,
                riskLevel: session.result?.riskLevel ?? null,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAssessment = (): AssessmentContextValue => {
    const ctx = useContext(AssessmentContext);
    if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
    return ctx;
};
