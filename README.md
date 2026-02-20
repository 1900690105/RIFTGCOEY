# 🧬 PharmacogenomicAI — AI Clinical Pharmacogenomics Decision Support

> **Healthcare should not be trial-and-error.**  
> PharmacogenomicAI predicts drug effectiveness **before prescription** using genomics + AI.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://nextjs.org/)
[![CPIC](https://img.shields.io/badge/Guidelines-CPIC-blue)](https://cpicpgx.org/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://riftgcoey.vercel.app/)

---

## 📋 Table of Contents

- [Problem](#-problem)
- [Solution](#-solution)
- [Live Demo](#-live-demo)
- [Core Capabilities](#-core-capabilities)
- [System Architecture](#️-system-architecture)
- [Supported Genes & Drugs](#-supported-pharmacogenomic-genes)
- [Input Requirements](#-input-requirements)
- [Example Clinical Output](#-example-clinical-output)
- [Doctor AI Assistant](#-doctor-ai-assistant)
- [Dashboards](#-dashboards)
- [JSON Report Export](#-json-clinical-report-export)
- [Tech Stack](#️-tech-stack)
- [Installation](#️-installation)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Validation Rules](#️-validation-rules)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Future Scope](#-future-scope)
- [Clinical Disclaimer](#️-clinical-disclaimer)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Problem

Patients often receive the correct medication but experience:

- ❌ **Treatment failure** — drug has no effect
- ☠️ **Drug toxicity** — severe adverse reactions
- 🩸 **Severe bleeding** — incorrect anticoagulant dosing
- 💔 **Stent thrombosis** — antiplatelet therapy failure

**Root cause:** Genes control drug metabolism, yet doctors currently prescribe drugs **without genetic context**.

---

## 💡 Solution

PharmacogenomicAI provides **pre-prescription genomic drug validation**.

```
Upload patient genomic data → AI predicts drug response → Doctor chooses safest therapy
```

By combining **CPIC pharmacogenomic guidelines** with **LLM medical reasoning**, our system gives clinicians actionable, evidence-backed guidance before the first prescription is written.

---

## 🚀 Live Demo

| Resource | Link |
|----------|------|
| 🌐 Frontend App | [riftgcoey.vercel.app](https://riftgcoey.vercel.app/) |
| ⚙️ Backend API | [rift-gcoey-backend-1.onrender.com](https://rift-gcoey-backend-1.onrender.com) |
| 🎥 Demo Video | [Watch on Google Drive](https://drive.google.com/file/d/1wZJh5rjnUJr9QhR9kn2JR5dkrnhkCgeX/view?usp=sharing) |

---

## 🧠 Core Capabilities

### 🔬 Genomic Analysis
- Parses **VCF v4.2** files
- Detects **pharmacogenomic star alleles**
- Generates **diplotype & phenotype**
- **CPIC-based risk classification**

### 🤖 AI Clinical Reasoning
- Medical explanation generation
- Drug mechanism interpretation
- Alternative therapy suggestion
- Evidence-level citation (CPIC 1A–3)

### 👨‍⚕️ Doctor Assistant
- **Voice + Text** chatbot interface
- Ask follow-up questions about reports
- Context-aware patient consultation
- Animated medical avatar

### 📊 Clinical Dashboard
- Doctor & patient report dashboards
- Expandable clinical explanation sections
- Downloadable structured JSON report

---

## 🏗️ System Architecture

```
Patient VCF File
      ↓
VCF Parser (FastAPI Engine)
      ↓
Gene Variant Detection
      ↓
CPIC Rule Engine
      ↓
Risk Classification
      ↓
Gemini AI Clinical Explanation
      ↓
Doctor Dashboard + Voice Assistant
```

---

## 🧬 Supported Pharmacogenomic Genes

| Gene | Function | Key Metabolizer Types |
|------|----------|-----------------------|
| **CYP2C19** | Antiplatelet metabolism | Poor / Ultrarapid |
| **CYP2C9** | Warfarin metabolism | Poor / Intermediate |
| **CYP2D6** | Opioid metabolism | Poor / Ultrarapid |
| **SLCO1B1** | Statin transport | Normal / Decreased |
| **TPMT** | Thiopurine toxicity | Poor / Intermediate |
| **DPYD** | Chemotherapy toxicity | Poor / Intermediate |

---

## 💊 Supported Drugs

| Drug | Gene | Risk Example |
|------|------|--------------|
| **CLOPIDOGREL** | CYP2C19 | Ineffective in Poor Metabolizers |
| **WARFARIN** | CYP2C9 | Bleeding risk / dose adjustment required |
| **CODEINE** | CYP2D6 | Toxic in Ultrarapid / No effect in Poor |
| **SIMVASTATIN** | SLCO1B1 | Myopathy risk at standard doses |
| **AZATHIOPRINE** | TPMT | Severe bone marrow toxicity |
| **FLUOROURACIL** | DPYD | Life-threatening toxicity |

---

## 📁 Input Requirements

### 1️⃣ VCF File

| Property | Requirement |
|----------|-------------|
| Format | VCF v4.2 |
| Max Size | 5 MB |
| Required INFO tags | `GENE`, `STAR`, `RS` |

**Example VCF entry:**
```vcf
##fileformat=VCFv4.2
#CHROM  POS       ID          REF  ALT  QUAL  FILTER  INFO
chr10   96541616  rs4244285   G    A    .     .       GENE=CYP2C19;STAR=*2;RS=rs4244285
chr10   96522463  rs4986893   G    A    .     .       GENE=CYP2C19;STAR=*3;RS=rs4986893
```

### 2️⃣ Drug Input

Supports **single OR multiple** drug queries:

```
# Single drug
Warfarin

# Multiple drugs (comma-separated)
Clopidogrel, Codeine, Warfarin
```

---

## 🧪 Example Clinical Output

```
Patient ID    : PT-2024-001
Gene          : CYP2C19
Diplotype     : *2/*3
Phenotype     : Poor Metabolizer
Drug          : Clopidogrel
Risk Level    : HIGH — Ineffective
Recommendation: Avoid Clopidogrel
Alternative   : Prasugrel (10 mg) or Ticagrelor (90 mg BID)
Evidence Level: CPIC Level 1A
Mechanism     : Reduced conversion of clopidogrel to active metabolite
                due to loss-of-function variants in CYP2C19
```

---

## 🎤 Doctor AI Assistant

The built-in AI assistant allows doctors to ask natural language follow-up questions:

| Example Questions |
|-------------------|
| "Why is this drug ineffective for this patient?" |
| "What is the mechanism behind this risk?" |
| "What alternative drug should be prescribed?" |
| "What monitoring is required during therapy?" |
| "What dose adjustment is recommended for warfarin?" |

**Input Methods:**
- 🎙️ Microphone (Web Speech API)
- ⌨️ Text input

**Output:**
- Spoken medical response (TTS)
- On-screen clinical text

---

## 📊 Dashboards

### 👨‍⚕️ Doctor Dashboard
- Patient genomic interpretation panel
- Clinical risk indicator (color-coded)
- AI-generated explanation sections (expandable)
- Follow-up Q&A chatbot

### 👤 Patient Dashboard
- Simplified, plain-language report
- Risk level understanding
- Therapy recommendation summary

---

## 🧾 JSON Clinical Report Export

One-click downloadable structured report including:

```json
{
  "patient_id": "PT-2024-001",
  "gene": "CYP2C19",
  "diplotype": "*2/*3",
  "phenotype": "Poor Metabolizer",
  "drug": "Clopidogrel",
  "risk_level": "HIGH",
  "recommendation": "Avoid Clopidogrel",
  "alternatives": ["Prasugrel", "Ticagrelor"],
  "cpic_evidence_level": "1A",
  "ai_explanation": "...",
  "generated_at": "2026-02-20T10:30:00Z"
}
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TailwindCSS, Web Speech API |
| **Backend** | FastAPI (Python 3.11), Custom VCF Parser, CPIC Rule Engine |
| **AI Layer** | Google Gemini API (Clinical Reasoning Engine) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Installation

### Prerequisites

- Node.js >= 18
- Python >= 3.11
- A Google Gemini API key

### 1. Clone Repositories

```bash
git clone https://github.com/1900690105/RIFTGCOEY              # Frontend
git clone https://github.com/1900690105/RIFT-GCOEY-backend     # Backend
```

### 2. Backend Setup

```bash
cd RIFT-GCOEY-backend/src/app/engine

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd RIFTGCOEY

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env.local` file in the frontend root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
NEXT_PUBLIC_API=http://localhost:8000
```

Create a `.env` file in the backend root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> ⚠️ Never commit API keys to version control. Add `.env` and `.env.local` to your `.gitignore`.

---

## 🔌 API Reference

### `POST /drug-risk`
Analyze a single drug against patient VCF data.

**Request (multipart/form-data):**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Patient VCF file (≤ 5MB) |
| `drug` | String | Drug name (e.g., `Clopidogrel`) |

**Response:**
```json
{
  "gene": "CYP2C19",
  "diplotype": "*2/*3",
  "phenotype": "Poor Metabolizer",
  "risk_level": "HIGH",
  "recommendation": "Avoid Clopidogrel",
  "alternatives": ["Prasugrel", "Ticagrelor"],
  "evidence_level": "1A",
  "ai_explanation": "..."
}
```

---

### `POST /batch-risk`
Analyze multiple drugs in a single request.

**Request (multipart/form-data):**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Patient VCF file (≤ 5MB) |
| `drugs` | String | Comma-separated drug names |

**Response:** Array of drug risk objects (same schema as `/drug-risk`).

---

### cURL Examples

```bash
# Single drug analysis
curl -X POST http://localhost:8000/drug-risk \
  -F "file=@patient.vcf" \
  -F "drug=Clopidogrel"

# Multiple drug analysis
curl -X POST http://localhost:8000/batch-risk \
  -F "file=@patient.vcf" \
  -F "drugs=Clopidogrel,Warfarin,Codeine"
```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd RIFT-GCOEY-backend
pytest tests/ -v
```

### Sample VCF for Testing

A sample VCF file is available at `tests/fixtures/sample_patient.vcf` for local testing.

### API Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "ok"}
```

---

## 🛡️ Validation Rules

| Rule | Behavior |
|------|----------|
| File size > 5MB | Rejected with error message |
| Non-VCF file uploaded | Rejected with format error |
| Missing `GENE`/`STAR`/`RS` tags | Rejected with tag error |
| Unsupported drug name | Returns graceful "unsupported drug" response |
| Malformed VCF format | Returns parsing error with line reference |

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Backend (Render)

1. Connect your GitHub repo to [Render](https://render.com)
2. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
3. Add environment variables in Render dashboard
4. Deploy

### Docker (Optional)

```bash
# Backend
cd RIFT-GCOEY-backend
docker build -t pharmacogenomicai-backend .
docker run -p 8000:8000 --env GEMINI_API_KEY=your_key pharmacogenomicai-backend
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/add-new-gene`
3. **Commit** your changes: `git commit -m "feat: add VKORC1 gene support"`
4. **Push** to the branch: `git push origin feature/add-new-gene`
5. **Open** a Pull Request

### Contribution Areas
- Adding new pharmacogenomic genes (e.g., VKORC1, UGT1A1)
- Expanding supported drug list
- Improving AI clinical reasoning prompts
- UI/UX improvements
- Writing unit and integration tests
- Documentation improvements

Please read `CONTRIBUTING.md` before submitting a PR.

---

## 🔮 Future Scope

- 🏥 **EHR integration** via HL7 FHIR standard
- 👥 **Real patient cohort validation** studies
- 🧬 **Additional pharmacogenes** (VKORC1, UGT1A1, G6PD, HLA-B)
- 🔌 **Hospital EMR plugin** (Epic, Cerner)
- 📱 **Mobile app** for bedside clinical use
- 🌍 **Multi-language support** for global deployment
- 🔒 **HIPAA-compliant** data storage and audit logs
- 📈 **Population-level analytics** dashboard
- 🤝 **Lab integration** for direct genomic data import

---

## ⚠️ Clinical Disclaimer

> **FOR RESEARCH AND EDUCATIONAL USE ONLY.**  
> PharmacogenomicAI is **not** a licensed medical device and is **not** a substitute for licensed clinical judgment. All recommendations must be reviewed by a qualified healthcare professional before any clinical action is taken. This tool does not establish a doctor-patient relationship and should not be used for direct patient care without appropriate clinical oversight.

---

## 👨‍💻 Team

Built for **RIFT 2026 PharmaGuard Challenge** by:

| Name | Role |
|------|------|
| *(Nikhil Kandhare)* | *(Full stack developer)* |
| *(Saraswati Adkine)* | *(Full stack developer)* |
| *(Pooja K)* | *(Research)* |
| *(Anushka V)* | *(Research)* |

---


for any query contact
+91 9112430021
nikhilkandhare22@gmail.com

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ for safer, smarter prescribing.</strong><br>
  <a href="https://riftgcoey.vercel.app/">Live Demo</a> · 
  <a href="https://github.com/1900690105/RIFTGCOEY/issues">Report Bug</a> · 
  <a href="https://github.com/1900690105/RIFTGCOEY/issues">Request Feature</a>
</div>
