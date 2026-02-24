// ============================================================
// AnemIA Scan — Mock Triage Questions
// Questions are now returned inline by POST /api/assessment/start
// ============================================================

import type { Question } from '../types';

export const mockQuestions: Question[] = [
    {
        id: 'q_age',
        type: 'number',
        text: 'How old is the child?',
        min: 0,
        max: 17,
        unit: 'years',
        required: true,
        hint: 'Enter the age in completed years',
    },
    {
        id: 'q_pallor',
        type: 'yes_no',
        text: 'Have you noticed paleness in the child\'s skin, lips, or gums?',
        hint: 'Compare with the child\'s usual skin color',
    },
    {
        id: 'q_fatigue',
        type: 'yes_no',
        text: 'Does the child show frequent fatigue or tiredness, even during light activities?',
    },
    {
        id: 'q_irritability',
        type: 'yes_no',
        text: 'Have you noticed irritability, unexplained crying, or mood changes?',
    },
    {
        id: 'q_school',
        type: 'yes_no',
        text: 'Have you noticed poor school performance, difficulty concentrating, or drowsiness in class?',
    },
    {
        id: 'q_appetite',
        type: 'yes_no',
        text: 'Has the child lost appetite or eats less than usual?',
    },
    {
        id: 'q_diet',
        type: 'multiple_choice',
        text: 'What foods does the child regularly eat? (Select all that apply)',
        options: [
            'Red meat (beef, liver)',
            'Chicken or fish',
            'Legumes (beans, lentils)',
            'Dark leafy vegetables (spinach, broccoli)',
            'Citrus fruits (orange, lemon)',
            'Fortified cereals',
            'None of the above',
        ],
    },
    {
        id: 'q_energy',
        type: 'scale',
        text: 'How would you rate the child\'s usual energy level over the last 2 weeks?',
        min: 1,
        max: 5,
        hint: '1 = Very low, 5 = Very high',
    },
    {
        id: 'q_prev_diagnosis',
        type: 'multiple_choice',
        text: 'Has the child had any of the following history?',
        options: [
            'Previous anemia diagnosis',
            'Iron treatment',
            'Premature birth',
            'Low birth weight',
            'None',
        ],
    },
    {
        id: 'q_symptoms_other',
        type: 'yes_no',
        text: 'Has the child experienced dizziness, fainting, or difficulty breathing during exercise?',
    },
];
