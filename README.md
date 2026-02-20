🧬 PharmacogenomicAI — AI Clinical Pharmacogenomics Decision Support

Healthcare should not be trial-and-error.
PharmacogenomicAI predicts drug effectiveness before prescription using genomics + AI.

PharmacogenomicAI is an AI-powered clinical assistant that analyzes patient genetic variants from a VCF file and predicts drug response risk using CPIC pharmacogenomic guidelines and LLM medical reasoning.

🎯 Problem

Patients often receive the correct medication but experience:

Treatment failure

Drug toxicity

Severe bleeding

Stent thrombosis

Because genes control drug metabolism.

Doctors currently prescribe drugs without genetic context.

💡 Solution

PharmacogenomicAI provides pre-prescription genomic drug validation.

Upload patient genomic data → AI predicts drug response → Doctor chooses safest therapy.

🧠 Core Capabilities
Genomic Analysis

Parses VCF v4.2 files

Detects pharmacogenomic star alleles

Generates diplotype & phenotype

CPIC-based risk classification

AI Clinical Reasoning

Medical explanation generation

Mechanism interpretation

Alternative therapy suggestion

Doctor Assistant

Voice + Text chatbot

Ask follow-up questions about report

Context-aware patient consultation

Clinical Dashboard

Doctor dashboard

Patient report dashboard

Expandable clinical explanation sections

Downloadable structured JSON report

🏗️ System Architecture
Patient VCF
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
🧬 Supported Pharmacogenomic Genes
Gene	Function
CYP2C19	Antiplatelet metabolism
CYP2C9	Warfarin metabolism
CYP2D6	Opioid metabolism
SLCO1B1	Statin transport
TPMT	Thiopurine toxicity
DPYD	Chemotherapy toxicity
💊 Supported Drugs
Drug	Gene	Risk Example
CLOPIDOGREL	CYP2C19	Ineffective in Poor Metabolizers
WARFARIN	CYP2C9	Bleeding risk / dose change
CODEINE	CYP2D6	Toxic or no effect
SIMVASTATIN	SLCO1B1	Myopathy risk
AZATHIOPRINE	TPMT	Severe toxicity
FLUOROURACIL	DPYD	Life-threatening toxicity
📁 Input Requirements
1️⃣ VCF File

Format: VCF v4.2

Max size: 5 MB

Required INFO tags:

GENE
STAR
RS

Example:

chr10 96541616 rs4244285 G A . . GENE=CYP2C19;STAR=*2;RS=rs4244285
2️⃣ Drug Input

Supports single OR multiple drugs

Warfarin
Clopidogrel, Codeine
🧪 Example Clinical Output
Phenotype: CYP2C19 Poor Metabolizer
Risk: Ineffective
Recommendation: Avoid Clopidogrel
Alternative: Prasugrel / Ticagrelor
Evidence Level: CPIC Level 1A
🎤 Doctor AI Assistant

Doctor can ask:

Why is drug ineffective?

What mechanism caused this?

What alternative drug should be used?

What monitoring is required?

Supports:

Microphone input

Text input

Spoken medical response

📊 Dashboards
Doctor Dashboard

Patient genomic interpretation

Clinical risk indicator

AI explanation sections

Follow-up Q&A chatbot

Patient Dashboard

Simplified report

Risk understanding

Therapy recommendation

🧾 JSON Clinical Report Export

One-click downloadable structured report including:

Risk classification

Diplotype

Phenotype

CPIC recommendation

AI explanation

Evidence level

🏗️ Tech Stack
Frontend

Next.js (App Router)

TailwindCSS

Web Speech API

Animated Medical Avatar

Backend

FastAPI (Python 3.11)

Custom VCF Parser

CPIC Rule Engine

AI Layer

Google Gemini API

Clinical reasoning engine

⚙️ Installation
Clone Repositories
git clone [https://github.com/YOUR_USERNAME/PharmacogenomicAI-frontend](https://github.com/1900690105/RIFTGCOEY)
git clone [https://github.com/YOUR_USERNAME/PharmacogenomicAI-backend](https://github.com/1900690105/RIFT-GCOEY-backend)
Backend Setup
cd backend/src/app/engine
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
Frontend Setup
cd frontend
npm install
npm run dev

App:

http://localhost:3000
🔐 Environment Variables

Create .env.local

GEMINI_API_KEY=YOUR_KEY
NEXT_PUBLIC_API=http://localhost:8000
🔌 API Endpoints
POST /drug-risk

Single drug analysis

POST /batch-risk

Multi drug analysis

🧪 CURL Example
curl -X POST http://localhost:8000/drug-risk \
  -F "file=@patient.vcf" \
  -F "drug=Clopidogrel"
🛡️ Validation Rules

Reject files > 5MB

Only VCF allowed

Must contain GENE/STAR/RS tags

Unsupported drug → graceful response

🚀 Deployment

Frontend: ([click here](https://riftgcoey.vercel.app/))
Backend: ([click here](https://rift-gcoey-backend-1.onrender.com))
Demo Video: ([click here](https://drive.google.com/file/d/1wZJh5rjnUJr9QhR9kn2JR5dkrnhkCgeX/view?usp=sharing))

🔮 Future Scope

EHR integration (FHIR)

Real patient cohort validation

Additional pharmacogenes

Hospital EMR plugin

Mobile app for bedside use

⚠️ Clinical Disclaimer

For research and educational use only. Not a substitute for licensed medical judgment.

👨‍💻 Team

Built for RIFT 2026 PharmaGuard Challenge by
Nikhil kandhare
Saraswati Adkine
Anushka V
Pooja K

for any query contact
+91 9112430021
nikhilkandhare22@gmail.com

📜 License

MIT License
