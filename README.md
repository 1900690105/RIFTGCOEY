# PharmacogenomicAI 🧬💊

AI‑powered pharmacogenomic decision support platform that analyzes a patient VCF genetic file and predicts drug response risk using CPIC guidelines + LLM clinical explanation.

---

## ✨ Features

* Upload genomic **VCF (v4.2)** file
* Detect pharmacogenomic variants (CYP2C19, CYP2C9, CYP2D6, SLCO1B1, TPMT, DPYD)
* Drug‑gene interaction risk prediction
* CPIC clinical recommendation engine
* AI generated medical explanation (Gemini)
* Doctor voice assistant (mic or text query)
* Speaking medical avatar
* JSON downloadable clinical report
* Multi‑drug support (comma separated)
* Tailwind medical UI dashboard

---

## 🧠 Supported Drugs

| Drug         | Gene    | Example Risk      |
| ------------ | ------- | ----------------- |
| CLOPIDOGREL  | CYP2C19 | Ineffective in PM |
| WARFARIN     | CYP2C9  | Dose adjustment   |
| CODEINE      | CYP2D6  | Toxic/No effect   |
| SIMVASTATIN  | SLCO1B1 | Myopathy risk     |
| AZATHIOPRINE | TPMT    | Toxicity risk     |
| FLUOROURACIL | DPYD    | Severe toxicity   |

---

## 📁 Input Requirements

### 1. VCF File

* Format: **VCF v4.2**
* Max size: **5 MB**
* Required INFO tags: `GENE`, `STAR`, `RS`

Example record:

```
chr10 96541616 rs4244285 G A . . GENE=CYP2C19;STAR=*2;RS=rs4244285
```

### 2. Drug Input

* Text input
* Single OR comma separated

```
Warfarin
Clopidogrel, Codeine
```

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* TailwindCSS
* Web Speech API (voice)

### Backend

* FastAPI
* Python 3.11
* CPIC rule engine
* VCF parser

### AI

* Google Gemini API (clinical explanation + doctor chat)

---

## ⚙️ Installation

### 1️⃣ Clone Repo

```
git clone https://github.com/1900690105/RIFT-GCOEY
cd RIFT-GCOEY
```

---

### 2️⃣ Backend Setup (FastAPI)

```
cd engine
python -m venv venv
venv\\Scripts\\activate   # windows
pip install -r requirements.txt
```

Run server:

```
uvicorn main:app --reload --port 8000
```

---

### 3️⃣ Frontend Setup (Next.js)

```
cd web
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

Create `.env.local` in frontend:

```
GEMINI_API_KEY=your_google_api_key
NEXT_PUBLIC_API=http://localhost:8000
```

---

## 🔌 API Endpoints

### POST `/drug-risk`

Single drug analysis

### POST `/batch-risk`

Multiple drug analysis

Request:

```
form-data:
file: patient.vcf
drug: Clopidogrel
```

---

## 📊 Output Example

```
Risk: Ineffective
Phenotype: CYP2C19 Poor Metabolizer
Recommendation: Avoid Clopidogrel
Alternative: Prasugrel / Ticagrelor
```

---

## 🎤 Doctor Assistant

Doctor can ask:

* Why drug ineffective?
* Dose adjustment?
* Alternative therapy?
* Mechanism explanation

Uses:

* Mic input OR text input
* Gemini clinical reasoning

---

## 📥 JSON Report Download

One‑click download of structured clinical report:

* Risk label
* Diplotype
* Phenotype
* CPIC recommendation
* AI explanation

---

## 🧪 Sample CURL

```
curl -X POST http://localhost:8000/drug-risk \
  -F "file=@patient.vcf" \
  -F "drug=Clopidogrel"
```

---

## 🛡️ Clinical Disclaimer

This tool is for **research & educational purposes only** and not a replacement for licensed medical decision making.

---

## 👨‍💻 Authors

Built for AI + Healthcare Hackathon

---

## 📄 License

MIT License
