# 👁️ AnemIA Scan

> **Early childhood anemia detection powered by MedGemma — camera + clinical questionnaire, no lab test required.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://anemia-check.vercel.app)
[![MedGemma](https://img.shields.io/badge/Model-MedGemma-blue?logo=google)](https://ai.google.dev/gemma/docs/medgemma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🩺 The Problem

**Anemia affects ~269 million children worldwide** and is the leading cause of preventable cognitive impairment in children under 5. In low-resource settings across Latin America, Africa, and Southeast Asia, diagnosis requires laboratory hemoglobin testing — an infrastructure that millions of families simply don't have access to.

Caregivers often wait until symptoms are severe before seeking help, because:
- Lab tests are unavailable or unaffordable
- Health facilities are geographically distant
- Early signs (pallor, fatigue) are subtle and easily dismissed

**There is a clear, unmet need for a fast, accessible, non-invasive pre-screening tool.**

---

## 💡 Our Solution

**AnemIA Scan** is a mobile-first web application that allows caregivers and community health workers to perform a preliminary anemia risk screening in under 3 minutes, using only a smartphone — no lab equipment required.

The screening combines two complementary signals:

| Signal | Method |
|---|---|
| 🖼️ **Visual biomarker** | Photo of the child's lower eyelid conjunctiva (palpebral conjunctiva). Pallor in this tissue is a known clinical proxy for anemia. |
| 📋 **Clinical symptoms** | Dynamic questionnaire covering fatigue, pallor, diet, appetite, and history — generated and personalized by the AI model. |

MedGemma analyzes both inputs **together** to produce a risk estimate (Low / Moderate / High) with a plain-language explanation and actionable recommendations tailored to the result.

---

## 🤖 How MedGemma is Used

AnemIA Scan uses **MedGemma** from Google's Health AI Developer Foundations (HAI-DEF) as its core analytical engine:

### 1. Image Validation (`POST /api/assessment/start`)
When a caregiver uploads an eye photo, MedGemma first **validates that the image is clinically appropriate** (i.e., it actually shows the palpebral conjunctiva, not an unrelated image). If the image is invalid, the user is informed and asked to retake the photo, with specific guidance.

### 2. Dynamic Question Generation
Based on the uploaded image and initial visual analysis, MedGemma **generates a personalized clinical questionnaire** — question set and order can vary per patient based on what the model detects visually.

### 3. Multimodal Risk Assessment (`POST /api/assessment/submit`)
MedGemma performs a **combined analysis** of:
- The conjunctiva image (visual pallor, vascularization)
- The caregiver's answers to the questionnaire (symptoms, diet, history)

The model returns:
```json
{
  "riskLevel": "medium",
  "explanation": "The conjunctiva shows slight paleness consistent with borderline hemoglobin levels...",
  "recommendations": [
    "Consult a doctor within the next 2 weeks",
    "Request a laboratory hemoglobin test",
    "..."
  ]
}
```

> **Why MedGemma?** General-purpose vision models are not trained on medical image distributions and lack clinical context. MedGemma's medical pretraining enables more reliable conjunctival pallor assessment without fine-tuning on a large labeled dataset.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER (Smartphone)                       │
│                                                             │
│   ┌─────────────┐         ┌──────────────────────────┐     │
│   │  Take Photo │──POST──▶│  POST /api/assessment/   │     │
│   │  (Camera /  │         │  start (multipart/form)  │     │
│   │   Gallery)  │         └──────────┬───────────────┘     │
│   └─────────────┘                    │                      │
│                                      ▼                      │
│                           ┌──────────────────────┐         │
│                           │     MedGemma         │         │
│                           │  • Validates image   │         │
│                           │  • Generates Qs      │         │
│                           └──────────┬───────────┘         │
│                                      │                      │
│   ┌─────────────┐         ┌──────────▼───────────┐         │
│   │ Questionnaire│◀───Qs──│  imageValid + Qs[]   │         │
│   │  (Dynamic)  │         └──────────────────────┘         │
│   └──────┬──────┘                                          │
│          │ Answers                                          │
│          ▼                                                  │
│   ┌─────────────┐         ┌──────────────────────┐         │
│   │  Submit     │──POST──▶│ POST /api/assessment/ │         │
│   │  Answers    │         │ submit               │         │
│   └─────────────┘         └──────────┬───────────┘         │
│                                      │                      │
│                           ┌──────────▼───────────┐         │
│                           │     MedGemma         │         │
│                           │  • Image + Answers   │         │
│                           │  • Risk estimate     │         │
│                           │  • Recommendations   │         │
│                           └──────────┬───────────┘         │
│                                      │                      │
│   ┌─────────────────────────────────▼──────────────┐      │
│   │ Results Screen: Risk Level + Explanation + Tips │      │
│   └────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Styling | Vanilla CSS with CSS Variables |
| Deployment | Vercel |

### Backend
| Layer | Technology |
|---|---|
| AI Model | MedGemma (Google HAI-DEF) |
| Runtime | Python / FastAPI |
| Image Processing | MedGemma multimodal inference |

### Infrastructure
- Mobile-first PWA (installable on iPhone / Android)
- SPA routing handled at CDN level via `vercel.json`
- Camera access via native HTML `<input type="file" accept="image/*">`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppShell.tsx          # Header + bottom navigation
│   └── QuestionRenderer.tsx  # Dynamic question type renderer
├── context/
│   └── AssessmentContext.tsx # Global session state
├── data/
│   ├── mockQuestions.ts      # Fallback questions (dev only)
│   ├── mockResults.ts        # Fallback results (dev only)
│   └── educationContent.ts   # Tips content per risk level
├── pages/
│   ├── Home.tsx              # Landing + quick access
│   ├── Assessment.tsx        # Photo + questionnaire flow
│   ├── Results.tsx           # Risk result + recommendations
│   └── Education.tsx         # Tips & suggestions by risk level
├── services/
│   └── assessmentService.ts  # API client (MedGemma backend)
├── styles/
│   └── global.css            # Design system (CSS variables)
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Backend API running (see Backend section)

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/LuisUmina/AnemiaCheck.git
cd AnemiaCheck

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and set your backend URL:
# VITE_API_BASE_URL=http://localhost:8000

# 4. Start development server
npm run dev
# Open http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔌 API Contract

The frontend expects the backend to implement the following endpoints:

### `POST /api/assessment/start`
Accepts a conjunctiva image, validates it, and returns personalized questions.

**Request:** `multipart/form-data`
```
image: File
```

**Response:**
```json
{
  "sessionId": "string",
  "imageValid": true,
  "validationMessage": "string",
  "questions": [
    {
      "id": "string",
      "type": "yes_no | scale | multiple_choice | number | text",
      "text": "string",
      "options": ["string"],
      "min": 1,
      "max": 5,
      "unit": "string",
      "required": true,
      "hint": "string"
    }
  ]
}
```

### `POST /api/assessment/submit`
Submits questionnaire answers and returns the combined risk assessment.

**Request:** `application/json`
```json
{
  "sessionId": "string",
  "answers": [
    { "questionId": "string", "value": "string | boolean | number | string[]" }
  ]
}
```

**Response:**
```json
{
  "riskLevel": "low | medium | high",
  "explanation": "string",
  "recommendations": ["string"]
}
```

---

## 📊 Impact Potential

| Metric | Estimate |
|---|---|
| Children at risk of anemia globally | ~269 million (WHO, 2023) |
| Children in Latin America alone | ~23 million |
| Average time for standard lab test | 1–3 days |
| **AnemIA Scan screening time** | **< 3 minutes** |
| Required equipment | Smartphone only |
| Cost per screening | $0 (after deployment) |

**Who benefits:**
- 👩 **Primary caregivers** who can screen their child at home before deciding to travel to a clinic
- 🏥 **Community health workers (CHWs)** who perform door-to-door visits in underserved areas
- 🏫 **School health programs** that conduct periodic screenings at scale

**Downstream impact:** Earlier detection → earlier dietary/supplementation intervention → reduced cognitive impairment, better school outcomes, and lower long-term healthcare costs.

---

## ⚠️ Clinical Disclaimer

AnemIA Scan is a **screening tool only** — it does not replace a clinical diagnosis. A laboratory hemoglobin test is required to confirm anemia. The tool is designed to help prioritize which children need urgent evaluation, not to substitute medical care.

---

## 🗺️ Roadmap

- [ ] **Backend integration** — Connect MedGemma inference pipeline to production
- [ ] **Offline mode** — PWA service worker for areas with low connectivity
- [ ] **Multilingual support** — Spanish, Portuguese, French (for LA and Africa)
- [ ] **CHW dashboard** — Batch screening history and referral tracking
- [ ] **Model validation study** — Clinical accuracy benchmarking vs. lab hemoglobin

---

## 🧑‍💻 Authors

Built for the **MedGemma Impact Challenge** — Google Health AI Developer Foundations.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
