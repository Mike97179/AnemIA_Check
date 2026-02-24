// ============================================================
// AnemIA Scan — Mock Education Content
// TODO: Replace with real API response from GET /api/education?riskLevel={level}
// ============================================================

import type { EducationContent, RiskLevel } from '../types';

const baseContent: EducationContent = {
    sections: [
        {
            id: 'what_is',
            icon: '🩺',
            title: 'What is childhood anemia?',
            content:
                'Anemia is a condition in which the blood does not have enough healthy red blood cells to carry oxygen to the body\'s tissues. In children, the most common cause is iron deficiency. It can affect physical and cognitive development as well as school performance.',
            riskLevels: ['low', 'medium', 'high'],
        },
        {
            id: 'signs',
            icon: '🔍',
            title: 'Warning signs',
            content:
                'Watch for: paleness in the skin, lips, and eye conjunctiva (inner part of the eyelid); unusual tiredness or fatigue; irritability or unexplained crying; poor school performance; loss of appetite; dizziness or fainting; brittle or fragile nails.',
            riskLevels: ['low', 'medium', 'high'],
        },
        {
            id: 'food_prevention',
            icon: '🍎',
            title: 'Diet & prevention',
            content:
                'Include in the diet: red meats and organ meats (liver, blood sausage), legumes (lentils, beans), dark leafy vegetables (spinach, watercress), and fortified cereals. Combine them with vitamin C (orange, lemon, tomato) to improve iron absorption. Avoid tea or coffee close to meals.',
            riskLevels: ['low', 'medium', 'high'],
        },
        {
            id: 'when_doctor',
            icon: '🏥',
            title: 'When to see a doctor?',
            content:
                'Consult a doctor if you notice several warning signs together, if the child has a previous diagnosis of anemia, if the child is under 2 years old with a diet poor in iron, or if symptoms are worsening. A hemoglobin test confirms the diagnosis.',
            riskLevels: ['low', 'medium', 'high'],
        },
        {
            id: 'treatment_adherence',
            icon: '💊',
            title: 'Treatment adherence',
            content:
                'If the doctor prescribed iron supplements: give them on an empty stomach or with orange juice for better absorption. Continue the full treatment even if the child "looks better." Regular check-ups are essential. Keep track of the schedule so you don\'t miss doses.',
            riskLevels: ['medium', 'high'],
        },
        {
            id: 'urgent_action',
            icon: '⚠️',
            title: 'Urgent action recommended',
            content:
                'The result suggests high risk. It is important to visit a health center soon to confirm the diagnosis with a laboratory test. Do not start medical treatment on your own. With timely care, anemia has a very good prognosis.',
            riskLevels: ['high'],
        },
    ],
};

// TODO: This function will be replaced by GET /api/education?riskLevel=xxx
export const getEducationContent = (riskLevel: RiskLevel): EducationContent => ({
    sections: baseContent.sections.filter((s) =>
        s.riskLevels.includes(riskLevel)
    ),
});
