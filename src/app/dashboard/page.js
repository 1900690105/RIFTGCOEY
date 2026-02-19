"use client";

import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  {
    id: "P-10421",
    name: "Anon Patient",
    drug: "Clopidogrel",
    risk: "ineffective",
    gene: "CYP2C19",
    date: "2026-02-19",
    diplotype: "*2/*2",
    phenotype: "Poor Metabolizer",
  },
  {
    id: "P-10398",
    name: "Anon Patient",
    drug: "Warfarin",
    risk: "adjust",
    gene: "CYP2C9",
    date: "2026-02-18",
    diplotype: "*1/*3",
    phenotype: "Intermediate Metabolizer",
  },
  {
    id: "P-10377",
    name: "Anon Patient",
    drug: "Codeine",
    risk: "toxic",
    gene: "CYP2D6",
    date: "2026-02-17",
    diplotype: "*1/*2xN",
    phenotype: "Ultrarapid Metabolizer",
  },
  {
    id: "P-10355",
    name: "Anon Patient",
    drug: "Simvastatin",
    risk: "safe",
    gene: "SLCO1B1",
    date: "2026-02-16",
    diplotype: "*1/*1",
    phenotype: "Normal Function",
  },
  {
    id: "P-10341",
    name: "Anon Patient",
    drug: "Azathioprine",
    risk: "toxic",
    gene: "TPMT",
    date: "2026-02-15",
    diplotype: "*3A/*3C",
    phenotype: "Poor Metabolizer",
  },
  {
    id: "P-10320",
    name: "Anon Patient",
    drug: "Fluorouracil",
    risk: "adjust",
    gene: "DPYD",
    date: "2026-02-14",
    diplotype: "*1/*2A",
    phenotype: "Intermediate Metabolizer",
  },
  {
    id: "P-10308",
    name: "Anon Patient",
    drug: "Warfarin",
    risk: "safe",
    gene: "CYP2C9",
    date: "2026-02-13",
    diplotype: "*1/*1",
    phenotype: "Normal Metabolizer",
  },
  {
    id: "P-10291",
    name: "Anon Patient",
    drug: "Codeine",
    risk: "ineffective",
    gene: "CYP2D6",
    date: "2026-02-12",
    diplotype: "*4/*4",
    phenotype: "Poor Metabolizer",
  },
];

const DRUG_LIBRARY = [
  {
    name: "Warfarin",
    gene: "CYP2C9 / VKORC1",
    risk: "Variable",
    rec: "Dose by genotype",
    class: "Anticoagulant",
    desc: "Warfarin metabolism is significantly affected by CYP2C9 and VKORC1 variants. Poor metabolizers require substantially reduced doses to avoid bleeding complications.",
  },
  {
    name: "Clopidogrel",
    gene: "CYP2C19",
    risk: "Ineffective",
    rec: "Consider alternative",
    class: "Antiplatelet",
    desc: "CYP2C19 poor metabolizers cannot adequately convert clopidogrel to its active form. Alternative agents such as prasugrel or ticagrelor are recommended.",
  },
  {
    name: "Codeine",
    gene: "CYP2D6",
    risk: "Toxic / Ineffective",
    rec: "Avoid in extremes",
    class: "Opioid Analgesic",
    desc: "Ultrarapid metabolizers convert codeine to morphine excessively, risking toxicity. Poor metabolizers receive no analgesic benefit.",
  },
  {
    name: "Simvastatin",
    gene: "SLCO1B1",
    risk: "Myopathy",
    rec: "Dose reduction",
    class: "Statin",
    desc: "SLCO1B1 variants reduce hepatic uptake of simvastatin, increasing plasma concentrations and myopathy risk.",
  },
  {
    name: "Azathioprine",
    gene: "TPMT / NUDT15",
    risk: "Myelotoxicity",
    rec: "Reduce dose / Avoid",
    class: "Immunosuppressant",
    desc: "TPMT deficiency leads to accumulation of toxic thiopurine metabolites. Genotype-guided dosing is critical to prevent severe bone marrow suppression.",
  },
  {
    name: "Fluorouracil",
    gene: "DPYD",
    risk: "Severe toxicity",
    rec: "Reduce dose 50%+",
    class: "Chemotherapy",
    desc: "DPYD variants reduce 5-FU catabolism, leading to drug accumulation and life-threatening toxicity including mucositis and neutropenia.",
  },
];

const REPORTS = [
  {
    id: "RPT-2024",
    patient: "P-10421",
    drugs: "Clopidogrel",
    risk: "ineffective",
    date: "2026-02-19",
  },
  {
    id: "RPT-2023",
    patient: "P-10398",
    drugs: "Warfarin",
    risk: "adjust",
    date: "2026-02-18",
  },
  {
    id: "RPT-2022",
    patient: "P-10377",
    drugs: "Codeine",
    risk: "toxic",
    date: "2026-02-17",
  },
  {
    id: "RPT-2021",
    patient: "P-10355",
    drugs: "Simvastatin",
    risk: "safe",
    date: "2026-02-16",
  },
  {
    id: "RPT-2020",
    patient: "P-10341",
    drugs: "Azathioprine",
    risk: "toxic",
    date: "2026-02-15",
  },
];

const PATIENT_PROFILE = {
  id: "P-10421",
  date: "2026-02-19",
  genes: [
    {
      gene: "CYP2C19",
      diplotype: "*2/*2",
      phenotype: "Poor Metabolizer",
      risk: "high",
    },
    {
      gene: "CYP2C9",
      diplotype: "*1/*1",
      phenotype: "Normal Metabolizer",
      risk: "normal",
    },
    {
      gene: "CYP2D6",
      diplotype: "*1/*2",
      phenotype: "Normal Metabolizer",
      risk: "normal",
    },
    {
      gene: "SLCO1B1",
      diplotype: "*1/*1",
      phenotype: "Normal Function",
      risk: "normal",
    },
  ],
  drugs: [
    {
      name: "Clopidogrel",
      status: "ineffective",
      icon: "❌",
      rec: "Use prasugrel or ticagrelor instead",
    },
    {
      name: "Warfarin",
      status: "adjust",
      icon: "⚠",
      rec: "Initiate at standard dose",
    },
    {
      name: "Codeine",
      status: "safe",
      icon: "✓",
      rec: "Standard dosing appropriate",
    },
  ],
  reports: [
    {
      drug: "Clopidogrel",
      risk: "ineffective",
      open: false,
      assessment:
        "Patient is a CYP2C19 poor metabolizer. Clopidogrel will not achieve therapeutic antiplatelet effect.",
      reasoning:
        "CYP2C19 *2/*2 genotype results in absent enzyme function. Clopidogrel requires CYP2C19 for bioactivation to its thiol metabolite.",
      cpic: "CPIC Level A — Strong recommendation to use alternative antiplatelet therapy.",
      ai: "The *2/*2 diplotype creates a loss-of-function state where the prodrug cannot be converted to its active inhibitor form, resulting in ADP-receptor mediated platelet aggregation proceeding unimpeded.",
      patient:
        "This medicine won't work for you because your body can't process it properly. Your doctor will switch you to a different medication.",
    },
    {
      drug: "Warfarin",
      risk: "safe",
      open: false,
      assessment:
        "CYP2C9 *1/*1 genotype suggests normal warfarin metabolism. Standard initiation appropriate.",
      reasoning:
        "Normal CYP2C9 activity predicts standard S-warfarin clearance. VKORC1 genotype not detected — assume intermediate sensitivity.",
      cpic: "CPIC Level A — Standard dose initiation acceptable with routine INR monitoring.",
      ai: "No clinically significant variants detected in CYP2C9. Standard pharmacokinetic profile expected with therapeutic INR achievable at normal dosing.",
      patient:
        "This blood thinning medicine should work normally for you at standard doses.",
    },
  ],
};

// ─── RISK STYLING ─────────────────────────────────────────────────────────────
const RISK = {
  safe: {
    label: "Safe",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    strip: "#16a34a",
  },
  adjust: {
    label: "Adjust",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    strip: "#d97706",
  },
  ineffective: {
    label: "Ineffective",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    strip: "#ea580c",
  },
  toxic: {
    label: "Toxic",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    strip: "#dc2626",
  },
  normal: {
    label: "Normal",
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
    strip: "#94a3b8",
  },
  high: {
    label: "High Risk",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    strip: "#dc2626",
  },
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", sw = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const icons = {
  patients: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0",
  ],
  analysis: ["M12 5v14", "M5 12h14"],
  library: [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  ],
  reports: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8",
  ],
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9",
  ],
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  chevron: "M9 18l6-6-6-6",
  chevronD: "M6 9l6 6 6-6",
  download: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M7 10l5 5 5-5",
    "M12 15V3",
  ],
  dna: [
    "M12 2c0 0-4 2.5-4 6s4 4 4 8-4 4.5-4 6",
    "M12 2c0 0 4 2.5 4 6s-4 4-4 8 4 4.5 4 6",
    "M8.5 5.5h7M8 12h8M8.5 18.5h7",
  ],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
  alert: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  check: "M20 6L9 17l-5-5",
  file: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
  ],
  user: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  ],
  beaker: ["M9 3h6l2 6-5 9H8L3 9l2-6z", "M3 9h18"],
  pill: "M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7",
  copy: [
    "M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2",
    "M16 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2",
  ],
  grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  back: ["M19 12H5", "M12 19l-7-7 7-7"],
};

const I = ({ name, size = 16 }) => <Icon d={icons[name]} size={size} />;

// ─── RISK BADGE ───────────────────────────────────────────────────────────────
const RiskBadge = ({ risk, small }) => {
  const r = RISK[risk] || RISK.normal;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${r.bg} ${r.text} ${r.border} border rounded font-semibold ${small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${r.dot} flex-shrink-0`} />
      {r.label}
    </span>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, sub, accent }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4">
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center ${accent}`}
      >
        <I name={icon} size={15} />
      </div>
      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
        {sub}
      </span>
    </div>
    <div className="text-2xl font-bold text-slate-900 font-mono mb-0.5">
      {value}
    </div>
    <div className="text-xs text-slate-500">{label}</div>
  </div>
);

// ─── TABLE ROW ────────────────────────────────────────────────────────────────
const Tr = ({ children, onClick, hover }) => (
  <tr
    onClick={onClick}
    className={`border-b border-slate-100 last:border-0 transition-colors ${hover ? "hover:bg-slate-50 cursor-pointer" : ""}`}
  >
    {children}
  </tr>
);
const Td = ({ children, mono, muted, fw }) => (
  <td
    className={`px-4 py-3 text-sm ${mono ? "font-mono" : ""} ${muted ? "text-slate-500" : "text-slate-800"} ${fw ? "font-semibold" : ""}`}
  >
    {children}
  </td>
);
const Th = ({ children }) => (
  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
    {children}
  </th>
);

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
const SectionTitle = ({ children, sub }) => (
  <div className="mb-5">
    <h2 className="text-base font-semibold text-slate-900">{children}</h2>
    {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────────
function PageDashboard({ setPage, setPatientId }) {
  const [file, setFile] = useState(null);
  const [drug, setDrug] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Welcome, Dr. Sharma
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinical Pharmacogenomics Dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Genomic Engine Active
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Patients Analyzed"
          value="247"
          icon="patients"
          sub="total"
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="High Risk Alerts"
          value="18"
          icon="alert"
          sub="this month"
          accent="bg-red-50 text-red-500"
        />
        <StatCard
          label="Adjusted Prescriptions"
          value="64"
          icon="pill"
          sub="active"
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Safe Prescriptions"
          value="165"
          icon="check"
          sub="confirmed"
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Main + Quick Analyze */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Analyses Table */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Recent Analyses
            </span>
            <button
              onClick={() => setPage("patients")}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <Th>Patient ID</Th>
                <Th>Drug</Th>
                <Th>Risk</Th>
                <Th>Gene</Th>
                <Th>Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {PATIENTS.slice(0, 6).map((p) => (
                <Tr
                  key={p.id}
                  hover
                  onClick={() => {
                    setPatientId(p.id);
                    setPage("profile");
                  }}
                >
                  <Td mono fw>
                    {p.id}
                  </Td>
                  <Td>{p.drug}</Td>
                  <Td>
                    <RiskBadge risk={p.risk} small />
                  </Td>
                  <Td mono muted>
                    {p.gene}
                  </Td>
                  <Td muted>{p.date}</Td>
                  <Td>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors">
                      View Report
                    </button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Analyze */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="text-sm font-semibold text-slate-800">
              Quick Analysis
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Upload VCF + enter drug
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Genomic File (.vcf)
            </label>
            {!file ? (
              <div
                onClick={() => document.getElementById("dash-file").click()}
                className="border border-dashed border-slate-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <input
                  id="dash-file"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && setFile(e.target.files[0].name)
                  }
                />
                <I name="file" size={18} />
                <div className="text-xs text-slate-500 mt-1.5">
                  Drop VCF file here
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                <I name="file" size={13} />
                <span className="text-xs font-medium text-slate-700 truncate flex-1">
                  {file}
                </span>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Medication(s)
            </label>
            <input
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              placeholder="e.g. warfarin, codeine"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Codeine", "Warfarin", "Clopidogrel"].map((d) => (
              <button
                key={d}
                onClick={() => setDrug(d)}
                className="text-[10px] font-medium px-2 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
          <button
            disabled={!file || !drug}
            onClick={() => setPage("analysis")}
            className={`w-full py-2 rounded-md text-xs font-semibold transition-colors ${file && drug ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            Analyze Risk
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Patients ───────────────────────────────────────────────────────────────────
function PagePatients({ setPage, setPatientId }) {
  const [q, setQ] = useState("");
  const filtered = PATIENTS.filter(
    (p) =>
      p.id.toLowerCase().includes(q.toLowerCase()) ||
      p.drug.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Patient Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {PATIENTS.length} patients analyzed
          </p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <I name="search" size={13} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patient ID or drug…"
            className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 w-52"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setPatientId(p.id);
              setPage("profile");
            }}
            className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {p.id}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Last visit: {p.date}
                </div>
              </div>
              <RiskBadge risk={p.risk} small />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Last drug</span>
                <div className="font-medium text-slate-700 mt-0.5">
                  {p.drug}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Primary gene</span>
                <div className="font-mono font-medium text-slate-700 mt-0.5">
                  {p.gene}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New Analysis ───────────────────────────────────────────────────────────────
function PageAnalysis() {
  const [file, setFile] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (d) =>
    setDrugs((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  const canGo = file && drugs.length > 0;

  const go = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    setLoading(false);
    setDone(true);
  };

  if (done)
    return (
      <div className="p-6 max-w-2xl">
        <SectionTitle>Analysis Complete</SectionTitle>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {PATIENT_PROFILE.reports.map((r) => (
            <div
              key={r.drug}
              className="border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-sm text-slate-800">
                  {r.drug}
                </span>
                <RiskBadge risk={r.risk} small />
              </div>
              <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed bg-slate-50 border-t border-slate-100">
                {r.assessment}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setDone(false);
            setFile(null);
            setDrugs([]);
          }}
          className="mt-4 text-xs text-blue-600 hover:underline"
        >
          ← New analysis
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-5 pb-4 border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-900">
          New Pharmacogenomic Analysis
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload patient VCF and select medications
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Genomic Data File (.vcf)
          </label>
          {!file ? (
            <div
              onClick={() => document.getElementById("new-file").click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition-colors"
            >
              <input
                id="new-file"
                type="file"
                accept=".vcf"
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] && setFile(e.target.files[0].name)
                }
              />
              <div className="text-slate-400 mb-2 flex justify-center">
                <I name="file" size={24} />
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Drag & drop or click to upload
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Supported: .vcf · Max 5MB
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <I name="file" size={16} />
              <span className="text-sm font-medium text-slate-800 flex-1">
                {file}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                ✓ Ready
              </span>
              <button
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-slate-600 text-sm ml-1"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Medication(s)
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type medication name or select below…"
            className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {[
              "Codeine",
              "Warfarin",
              "Clopidogrel",
              "Simvastatin",
              "Azathioprine",
              "Fluorouracil",
            ].map((d) => (
              <button
                key={d}
                onClick={() => toggle(d)}
                className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${drugs.includes(d) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <button
            disabled={!canGo || loading}
            onClick={go}
            className={`w-full py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${canGo ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity=".25"
                    strokeWidth="4"
                  />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing genome…
              </>
            ) : (
              <>
                <I name="beaker" size={15} /> Analyze Pharmacogenomic Risk
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Patient Profile ────────────────────────────────────────────────────────────
function PageProfile({ setPage }) {
  const p = PATIENT_PROFILE;
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <button
          onClick={() => setPage("patients")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-3 transition-colors"
        >
          <I name="back" size={13} /> Back to patients
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center">
              <I name="user" size={17} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900 font-mono">
                {p.id}
              </h1>
              <div className="text-xs text-slate-500">
                Last analysis: {p.date}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium border border-slate-200 bg-white px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
              <I name="download" size={12} /> Download Report
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
              <I name="beaker" size={12} /> Re-analyze
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Genetic Summary */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Genetic Profile
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Gene</Th>
                  <Th>Diplotype</Th>
                  <Th>Phenotype</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {p.genes.map((g) => (
                  <Tr key={g.gene}>
                    <Td mono fw>
                      {g.gene}
                    </Td>
                    <Td mono muted>
                      {g.diplotype}
                    </Td>
                    <Td>{g.phenotype}</Td>
                    <Td>
                      <RiskBadge risk={g.risk} small />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medication Compatibility */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Medication Compatibility
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Drug</Th>
                  <Th>Status</Th>
                  <Th>Recommendation</Th>
                </tr>
              </thead>
              <tbody>
                {p.drugs.map((d) => (
                  <Tr key={d.name}>
                    <Td fw>{d.name}</Td>
                    <Td>
                      <span className="font-mono text-base">{d.icon}</span>{" "}
                      <RiskBadge risk={d.status} small />
                    </Td>
                    <Td muted>{d.rec}</Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Drug Reports */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Detailed Drug Reports
              </span>
            </div>
            {p.reports.map((r, i) => (
              <div
                key={r.drug}
                className="border-b border-slate-100 last:border-0"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-slate-800">
                      {r.drug}
                    </span>
                    <RiskBadge risk={r.risk} small />
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === i ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                {openIdx === i && (
                  <div className="px-4 pb-4 space-y-3 bg-slate-50 border-t border-slate-100">
                    {[
                      { label: "Risk Assessment", val: r.assessment },
                      { label: "Genetic Reasoning", val: r.reasoning },
                      { label: "CPIC Recommendation", val: r.cpic },
                      { label: "AI Explanation", val: r.ai },
                      { label: "Patient-Friendly", val: r.patient, blue: true },
                    ].map((sec) => (
                      <div
                        key={sec.label}
                        className={`rounded-md p-3 border text-xs leading-relaxed ${sec.blue ? "bg-blue-50 border-blue-100 text-blue-800" : "bg-white border-slate-200 text-slate-700"}`}
                      >
                        <div
                          className={`font-semibold uppercase tracking-wider text-[10px] mb-1.5 ${sec.blue ? "text-blue-500" : "text-slate-400"}`}
                        >
                          {sec.label}
                        </div>
                        {sec.val}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Risk Summary
            </div>
            <div className="space-y-2">
              {p.drugs.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{d.name}</span>
                  <RiskBadge risk={d.status} small />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Key Genes
            </div>
            <div className="space-y-2">
              {p.genes.map((g) => (
                <div key={g.gene}>
                  <div className="font-mono text-xs font-semibold text-slate-800">
                    {g.gene}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {g.phenotype}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="text-amber-500 mt-0.5">
                <I name="alert" size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-800">
                  Clinical Alert
                </div>
                <div className="text-xs text-amber-700 mt-1 leading-relaxed">
                  CYP2C19 poor metabolizer — clopidogrel contraindicated.
                  Prescriber action required.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Drug Library ───────────────────────────────────────────────────────────────
function PageLibrary() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const filtered = DRUG_LIBRARY.filter(
    (d) =>
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.gene.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Drug Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pharmacogenomic reference database
          </p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <I name="search" size={13} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search drug or gene…"
            className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 w-52"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((d, i) => (
          <div
            key={d.name}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div>
                <div className="font-semibold text-sm text-slate-900">
                  {d.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">
                  {d.class}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-slate-500">{d.gene}</div>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  {d.risk}
                </span>
              </div>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {open === i ? "Collapse ↑" : "Details →"}
              </button>
            </div>
            {open === i && (
              <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                <div className="text-xs text-slate-600 leading-relaxed mt-3">
                  {d.desc}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Typical Recommendation
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    {d.rec}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reports ────────────────────────────────────────────────────────────────────
function PageReports({ setPage, setPatientId }) {
  return (
    <div className="p-6">
      <div className="mb-5 pb-4 border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-900">
          Generated Reports
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {REPORTS.length} reports available
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <Th>Report ID</Th>
              <Th>Patient</Th>
              <Th>Drug(s)</Th>
              <Th>Highest Risk</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r) => (
              <Tr
                key={r.id}
                hover
                onClick={() => {
                  setPatientId(r.patient);
                  setPage("profile");
                }}
              >
                <Td mono fw>
                  {r.id}
                </Td>
                <Td mono>{r.patient}</Td>
                <Td>{r.drugs}</Td>
                <Td>
                  <RiskBadge risk={r.risk} small />
                </Td>
                <Td muted>{r.date}</Td>
                <Td>
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="flex items-center gap-1 text-xs text-slate-600 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors">
                      <I name="download" size={11} /> JSON
                    </button>
                    <button className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded hover:bg-blue-50 transition-colors">
                      <I name="reports" size={11} /> View
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────────
function PageSettings() {
  const rows = [
    { label: "API Status", val: "Connected", ok: true },
    { label: "LLM Model", val: "claude-sonnet-4-6" },
    { label: "CPIC Database", val: "v1.19 (Feb 2026)" },
    { label: "VCF Parser Version", val: "2.4.1" },
    { label: "Analysis Engine", val: "Online · 99.8% uptime", ok: true },
  ];
  const genes = [
    "CYP2D6",
    "CYP2C19",
    "CYP2C9",
    "SLCO1B1",
    "TPMT",
    "DPYD",
    "VKORC1",
    "G6PD",
    "NAT2",
    "IFNL3",
  ];

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-900">
          System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configuration and system status
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            System Status
          </span>
        </div>
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0"
          >
            <span className="text-sm text-slate-600">{r.label}</span>
            <span
              className={`text-xs font-medium font-mono ${r.ok ? "text-emerald-600" : "text-slate-700"}`}
            >
              {r.val}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Supported Genes ({genes.length})
          </span>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {genes.map((g) => (
            <span
              key={g}
              className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            About PharmaGuard
          </span>
        </div>
        <div className="p-4 space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <span className="font-semibold text-slate-800">PharmaGuard</span> is
            an AI-powered clinical decision support system for pharmacogenomic
            analysis.
          </p>
          <p>
            Built for RIFT 2026 HealthTech Track. Provides
            CPIC-guideline-aligned drug safety recommendations based on patient
            genomic profiles.
          </p>
          <div className="pt-2 flex gap-3 text-[10px] text-slate-400">
            <span>Version 1.0.0</span>
            <span>·</span>
            <span>RIFT 2026 Prototype</span>
            <span>·</span>
            <span>Not for clinical use</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const [patientId, setPatientId] = useState(null);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "grid" },
    { id: "patients", label: "Patients", icon: "patients" },
    { id: "analysis", label: "New Analysis", icon: "analysis" },
    { id: "library", label: "Drug Library", icon: "library" },
    { id: "reports", label: "Reports", icon: "reports" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <PageDashboard setPage={setPage} setPatientId={setPatientId} />;
      case "patients":
        return <PagePatients setPage={setPage} setPatientId={setPatientId} />;
      case "analysis":
        return <PageAnalysis />;
      case "profile":
        return <PageProfile setPage={setPage} />;
      case "library":
        return <PageLibrary />;
      case "reports":
        return <PageReports setPage={setPage} setPatientId={setPatientId} />;
      case "settings":
        return <PageSettings />;
      default:
        return <PageDashboard setPage={setPage} setPatientId={setPatientId} />;
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          {/* Logo */}
          <div className="px-4 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 leading-tight">
                  PharmaGuard
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Clinical Dashboard
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors text-sm ${
                  page === item.id ||
                  (item.id === "patients" && page === "profile")
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span
                  className={`flex-shrink-0 ${page === item.id ? "text-blue-600" : "text-slate-400"}`}
                >
                  <I name={item.icon} size={15} />
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Doctor Profile */}
          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200">
                <I name="user" size={13} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  Dr. Sharma
                </div>
                <div className="text-[10px] text-slate-400">Clinician</div>
              </div>
            </div>
            <button className="w-full flex items-center gap-2 text-[11px] text-slate-500 hover:text-red-600 py-1 px-2 rounded hover:bg-red-50 transition-colors">
              <I name="logout" size={12} /> Logout
            </button>
          </div>
        </aside>

        {/* ── Main Workspace ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
