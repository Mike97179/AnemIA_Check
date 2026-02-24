// ============================================================
// AnemIA Scan — Mock Assessment Result
// ============================================================

import type { AssessmentResult, RiskLevel } from '../types';

export const mockResults: Record<RiskLevel, AssessmentResult> = {
    low: {
        riskLevel: 'low',
        explanation:
            'The combined analysis of the conjunctiva image and reported symptoms indicates a low risk of anemia. The conjunctival coloring shows good blood supply and the clinical symptoms do not suggest a significant iron deficiency at this time.',
        recommendations: [
            'Maintain a balanced diet rich in iron (meat, legumes, green vegetables)',
            'Eat foods high in vitamin C to improve iron absorption',
            'Schedule a preventive medical check-up within the next 6 months',
            'Continue with regular growth and development assessments',
        ],
    },
    medium: {
        riskLevel: 'medium',
        explanation:
            'The multimodal analysis detected moderate indicators of possible anemia. The conjunctiva shows slight paleness and several reported clinical symptoms are consistent with hemoglobin levels at the lower limit. Medical evaluation is recommended soon.',
        recommendations: [
            'Consult a doctor or health center within the next 2 weeks',
            'Get a laboratory hemoglobin test to confirm',
            'Increase consumption of foods rich in heme iron (red meat, liver)',
            'Avoid tea and coffee close to main meals (they inhibit iron absorption)',
            'Combine iron-rich foods with vitamin C to improve absorption',
        ],
    },
    high: {
        riskLevel: 'high',
        explanation:
            'The analysis indicates a high risk of anemia. The conjunctiva shows significant paleness and the reported symptoms are consistent with a significant iron deficiency. Urgent medical evaluation is necessary to confirm the diagnosis and begin treatment.',
        recommendations: [
            '⚠️ Visit a doctor or health center as soon as possible (within the next few days)',
            'Request a hemoglobin and hematocrit blood test',
            'Do not start iron supplements without medical guidance',
            'Watch for warning signs: difficulty breathing, fainting, or extreme paleness',
            'Maintain adequate hydration and relative rest',
        ],
    },
};

export const getMockResult = (riskLevel: RiskLevel = 'medium'): AssessmentResult =>
    mockResults[riskLevel];
