"use client";

import { useState } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PATIENT = {
  id: "P-10421",
  analysisDate: "February 19, 2026",
  analysisTime: "09:41 AM",
  drugsEvaluated: 3,
  vcfFile: "patient_10421_genome.vcf",
  analyst: "PharmaGuard AI · CPIC v1.19",

  genes: [
    {
      name: "CYP2C19",
      phenotype: "Poor Metabolizer",
      activity: 0,
      impact: "high",
      diplotype: "*2/*2",
      variants: ["rs4244285", "rs4986893"],
    },
    {
      name: "CYP2C9",
      phenotype: "Normal Metabolizer",
      activity: 1.0,
      impact: "normal",
      diplotype: "*1/*1",
      variants: ["rs1799853"],
    },
    {
      name: "CYP2D6",
      phenotype: "Normal Metabolizer",
      activity: 1.0,
      impact: "normal",
      diplotype: "*1/*2",
      variants: ["rs16947"],
    },
    {
      name: "SLCO1B1",
      phenotype: "Reduced Function",
      activity: 0.5,
      impact: "moderate",
      diplotype: "*1/*5",
      variants: ["rs4149056"],
    },
    {
      name: "TPMT",
      phenotype: "Normal Activity",
      activity: 1.0,
      impact: "normal",
      diplotype: "*1/*1",
      variants: [],
    },
    {
      name: "DPYD",
      phenotype: "Normal Activity",
      activity: 1.0,
      impact: "normal",
      diplotype: "*1/*1",
      variants: [],
    },
  ],

  medications: [
    {
      name: "Clopidogrel",
      status: "ineffective",
      statusLabel: "Ineffective",
      reason: "No enzymatic activation",
      action: "Use alternative",
      actionType: "danger",
      confidence: 92,
      gene: "CYP2C19",
      diplotype: "*2/*2",
      phenotype: "Poor Metabolizer",
      variants: ["rs4244285", "rs4986893"],
      cpicLevel: "A",
      recommendation:
        "Avoid clopidogrel. CYP2C19 poor metabolizer status results in absent prodrug activation. Switch to prasugrel 10 mg or ticagrelor 90 mg BID.",
      mechanism:
        "Clopidogrel is a prodrug requiring hepatic CYP2C19 to generate its active thiol metabolite. The *2/*2 diplotype abolishes CYP2C19 function entirely. Without bioactivation, the drug cannot bind platelet P2Y12 receptors, leaving ADP-induced aggregation fully intact.",
      patientExplanation:
        "This blood clot prevention medicine won't work for you because your body cannot convert it into its active form. Your doctor will prescribe a different medicine that works through a different pathway.",
    },
    {
      name: "Warfarin",
      status: "adjust",
      statusLabel: "Adjust Dose",
      reason: "Intermediate CYP2C9 metabolism",
      action: "Reduce initial dose",
      actionType: "caution",
      confidence: 87,
      gene: "CYP2C9",
      diplotype: "*1/*1",
      phenotype: "Normal Metabolizer",
      variants: ["rs1799853"],
      cpicLevel: "A",
      recommendation:
        "Initiate at standard dose with close INR monitoring. No CYP2C9 dose reduction required. Check VKORC1 and CYP4F2 for complete dosing algorithm.",
      mechanism:
        "CYP2C9 *1/*1 predicts normal S-warfarin clearance. Standard pharmacokinetics expected. VKORC1 genotype not detected in this sample — assume intermediate sensitivity. Weekly INR checks recommended for the first month.",
      patientExplanation:
        "This blood-thinning medicine should work normally at standard doses. Your doctor will monitor your blood regularly to make sure the dose stays in the safe range.",
    },
    {
      name: "Codeine",
      status: "safe",
      statusLabel: "Safe",
      reason: "Normal CYP2D6 activity",
      action: "Standard dosing",
      actionType: "ok",
      confidence: 95,
      gene: "CYP2D6",
      diplotype: "*1/*2",
      phenotype: "Normal Metabolizer",
      variants: ["rs16947"],
      cpicLevel: "A",
      recommendation:
        "Normal metabolizer. Standard codeine dosing appropriate. Monitor for standard opioid side effects. No pharmacogenomic dose adjustment required.",
      mechanism:
        "CYP2D6 *1/*2 predicts normal enzyme activity. Codeine is converted to morphine at expected rates, providing therapeutic analgesia without accumulation. No risk of ultrarapid metabolism toxicity.",
      patientExplanation:
        "Your body processes this pain medicine at a normal rate, so it will work as expected without building up to dangerous levels.",
    },
  ],

  alerts: [
    {
      level: "critical",
      text: "Clopidogrel contraindicated — CYP2C19 poor metabolizer. Prescriber action required before dispensing.",
    },
    {
      level: "warning",
      text: "VKORC1 not genotyped — warfarin dosing algorithm incomplete. Consider additional testing.",
    },
    {
      level: "info",
      text: "SLCO1B1 *1/*5 detected — reduced statin transport. Note for future statin prescriptions.",
    },
  ],
};

// ─── RISK CONFIG ──────────────────────────────────────────────────────────────
const RISK = {
  ineffective: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#B91C1C",
    dot: "#EF4444",
    stripBg: "#DC2626",
    label: "Ineffective",
    icon: "✕",
  },
  adjust: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    text: "#92400E",
    dot: "#F59E0B",
    stripBg: "#D97706",
    label: "Adjust Dose",
    icon: "~",
  },
  safe: {
    bg: "#F0FDF4",
    border: "#A7F3D0",
    text: "#065F46",
    dot: "#10B981",
    stripBg: "#059669",
    label: "Safe",
    icon: "✓",
  },
  toxic: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#7F1D1D",
    dot: "#DC2626",
    stripBg: "#991B1B",
    label: "Toxic",
    icon: "☠",
  },
};

const IMPACT = {
  high: {
    label: "High Clinical Impact",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
  moderate: {
    label: "Moderate Impact",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  normal: {
    label: "Normal Function",
    color: "#10B981",
    bg: "#F0FDF4",
    border: "#A7F3D0",
  },
};

const ALERT_STYLE = {
  critical: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#991B1B",
    dot: "#EF4444",
    icon: "⚠",
  },
  warning: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    text: "#78350F",
    dot: "#F59E0B",
    icon: "△",
  },
  info: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    text: "#1E40AF",
    dot: "#3B82F6",
    icon: "ℹ",
  },
};

// ─── ACTIVITY BAR ─────────────────────────────────────────────────────────────
function ActivityBar({ value, impact }) {
  const segments = 8;
  const filled = Math.round(value * segments);
  const c =
    impact === "high"
      ? "#EF4444"
      : impact === "moderate"
        ? "#F59E0B"
        : "#10B981";
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 8,
            borderRadius: 2,
            backgroundColor: i < filled ? c : "#E5E7EB",
            transition: "background-color 0.2s",
          }}
        />
      ))}
    </div>
  );
}

// ─── GENE CARD ────────────────────────────────────────────────────────────────
function GeneCard({ gene }) {
  const imp = IMPACT[gene.impact];
  const speedLabel =
    gene.activity === 0
      ? "None"
      : gene.activity < 0.5
        ? "Very Slow"
        : gene.activity < 1
          ? "Reduced"
          : gene.activity === 1
            ? "Normal"
            : "Rapid";

  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${gene.impact === "high" ? "#FECACA" : gene.impact === "moderate" ? "#FDE68A" : "#E5E7EB"}`,
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "0.02em",
            }}
          >
            {gene.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#64748B",
              marginTop: 1,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {gene.diplotype}
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: imp.bg,
            border: `1px solid ${imp.border}`,
            borderRadius: 4,
            padding: "2px 7px",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: imp.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 600, color: imp.color }}>
            {imp.label}
          </span>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#1E293B",
            marginBottom: 6,
          }}
        >
          {gene.phenotype}
        </div>
        <ActivityBar value={gene.activity} impact={gene.impact} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 10, color: "#94A3B8" }}>
            Enzyme Activity
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: imp.color }}>
            {speedLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MEDICATION ROW ───────────────────────────────────────────────────────────
function MedRow({ med }) {
  const r = RISK[med.status];
  return (
    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
      <td
        style={{
          padding: "12px 16px",
          fontWeight: 600,
          fontSize: 13,
          color: "#0F172A",
        }}
      >
        {med.name}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: r.bg,
            border: `1px solid ${r.border}`,
            color: r.text,
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 4,
          }}
        >
          <span style={{ fontSize: 12 }}>{r.icon}</span>
          {r.label}
        </span>
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>
        {med.reason}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color:
              med.actionType === "danger"
                ? "#B91C1C"
                : med.actionType === "caution"
                  ? "#92400E"
                  : "#065F46",
            background:
              med.actionType === "danger"
                ? "#FEF2F2"
                : med.actionType === "caution"
                  ? "#FFFBEB"
                  : "#F0FDF4",
            border: `1px solid ${med.actionType === "danger" ? "#FECACA" : med.actionType === "caution" ? "#FDE68A" : "#A7F3D0"}`,
            padding: "3px 10px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {med.action}
        </span>
      </td>
    </tr>
  );
}

// ─── DRUG ACCORDION CARD ──────────────────────────────────────────────────────
function DrugAccordion({ med, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const r = RISK[med.status];

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        overflow: "hidden",
        background: "white",
      }}
    >
      {/* Risk Strip Header */}
      <div
        style={{
          background: r.stripBg,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              color: "white",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            {med.name.toUpperCase()}
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            {r.label.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 10,
                fontWeight: 500,
              }}
            >
              CONFIDENCE
            </div>
            <div
              style={{
                color: "white",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {med.confidence}%
            </div>
          </div>
          {/* Confidence mini-bar */}
          <div
            style={{
              width: 48,
              height: 4,
              background: "rgba(255,255,255,0.25)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${med.confidence}%`,
                height: "100%",
                background: "rgba(255,255,255,0.9)",
                borderRadius: 2,
              }}
            />
          </div>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              borderRadius: 6,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              transition: "background 0.15s",
            }}
          >
            {open ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* A — Genetic Reasoning */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              Genetic Reasoning
            </div>
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "14px 16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 24px",
              }}
            >
              {[
                ["Primary Gene", med.gene],
                ["Diplotype", med.diplotype],
                ["Phenotype", med.phenotype],
                ["Detected Variants", med.variants.join(", ") || "None"],
              ].map(([label, val]) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B — Clinical Recommendation */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              Clinical Recommendation
            </div>
            <div
              style={{
                background: r.bg,
                border: `1px solid ${r.border}`,
                borderRadius: 8,
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#1E293B",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {med.recommendation}
              </p>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "white",
                  border: `1px solid ${r.border}`,
                  color: r.text,
                  padding: "4px 10px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                CPIC Level {med.cpicLevel}
              </span>
            </div>
          </div>

          {/* C — Biological Mechanism */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              Biological Mechanism
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "14px 16px",
                borderLeft: "3px solid #3B82F6",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#334155",
                  lineHeight: 1.8,
                }}
              >
                {med.mechanism}
              </p>
            </div>
          </div>

          {/* D — Patient-Friendly */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              Patient-Friendly Explanation
            </div>
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 8,
                padding: "14px 16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#1D4ED8",
                  lineHeight: 1.8,
                }}
              >
                {med.patientExplanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientProfile({ onBack }) {
  const p = PATIENT;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(p, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
        paddingBottom: 64,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; }
      `}</style>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Back Nav ───────────────────────────────────────────────────── */}
        <div style={{ padding: "18px 0 0" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#64748B",
              fontSize: 12,
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1E293B")}
            onMouseLeave={(e) => (e.target.style.color = "#64748B")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Patients
          </button>
        </div>

        {/* ── Patient Header ─────────────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 12,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {/* Info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0F172A",
                    letterSpacing: "0.02em",
                  }}
                >
                  {p.id}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    color: "#1D4ED8",
                    padding: "3px 9px",
                    borderRadius: 999,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Pharmacogenomic Profile Generated
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 5 }}>
                {[
                  ["Last Analysis", `${p.analysisDate} · ${p.analysisTime}`],
                  ["Drugs Evaluated", p.drugsEvaluated],
                  ["Source File", p.vcfFile],
                  ["Engine", p.analyst],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 500,
                      }}
                    >
                      {label}:
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#475569",
                        fontWeight: 500,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                background: "white",
                border: "1px solid #E5E7EB",
                padding: "8px 14px",
                borderRadius: 7,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {copied ? "Copied!" : "Download Report"}
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "white",
                background: "#2563EB",
                border: "1px solid #1D4ED8",
                padding: "8px 14px",
                borderRadius: 7,
                cursor: "pointer",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3h6l2 6-5 9H8L3 9l2-6z" />
                <path d="M3 9h18" />
              </svg>
              Re-Analyze
            </button>
          </div>
        </div>

        {/* ── 3-column summary row ──────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* ── Genetic Summary ───────────────────────────────────────────── */}
          <div
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid #F1F5F9",
                background: "#FAFAFA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Genetic Summary
              </span>
              <span style={{ fontSize: 10, color: "#94A3B8" }}>
                {p.genes.length} genes analyzed
              </span>
            </div>
            <div
              style={{
                padding: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {p.genes.map((g) => (
                <GeneCard key={g.name} gene={g} />
              ))}
            </div>
          </div>

          {/* ── Medication Compatibility + Alerts ─────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Medication Table */}
            <div
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid #F1F5F9",
                  background: "#FAFAFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Medication Compatibility
                </span>
                <span style={{ fontSize: 10, color: "#94A3B8" }}>
                  Decision-first view
                </span>
              </div>
              <table>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Medication", "Status", "Reason", "Action"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 16px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94A3B8",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          background: "#F8FAFC",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.medications.map((med) => (
                    <MedRow key={med.name} med={med} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts Panel */}
            <div
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid #F1F5F9",
                  background: "#FAFAFA",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Clinical Alerts
                </span>
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {p.alerts.map((alert, i) => {
                  const s = ALERT_STYLE[alert.level];
                  return (
                    <div
                      key={i}
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        borderRadius: 7,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: s.dot,
                          lineHeight: 1.4,
                          flexShrink: 0,
                        }}
                      >
                        {s.icon}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: s.text,
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        {alert.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detailed Drug Reports ─────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #F1F5F9",
              background: "#FAFAFA",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Detailed Drug Reports
              </span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 12 }}>
                Genetic reasoning · CPIC recommendations · AI explanations
              </span>
            </div>
            <span style={{ fontSize: 10, color: "#94A3B8" }}>
              Click card to expand
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {p.medications.map((med, i) => (
              <DrugAccordion key={med.name} med={med} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* ── Phenotype Visualization ───────────────────────────────────── */}
        <div
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid #F1F5F9",
              background: "#FAFAFA",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Metabolism Speed Reference
            </span>
          </div>
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {p.genes
              .filter((g) => g.variants.length > 0 || g.activity < 1)
              .map((g) => {
                const imp = IMPACT[g.impact];
                const speedLabel =
                  g.activity === 0
                    ? "None / Absent"
                    : g.activity < 0.5
                      ? "Very Slow"
                      : g.activity < 1
                        ? "Reduced"
                        : "Normal";
                return (
                  <div
                    key={g.name}
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#475569",
                        width: 80,
                        flexShrink: 0,
                      }}
                    >
                      {g.name}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                      }}
                    >
                      {Array.from({ length: 8 }).map((_, i) => {
                        const filled = Math.round(g.activity * 8);
                        return (
                          <div
                            key={i}
                            style={{
                              height: 12,
                              flex: 1,
                              borderRadius: 3,
                              background: i < filled ? imp.color : "#E5E7EB",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: imp.color,
                          width: 80,
                        }}
                      >
                        {speedLabel}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: imp.bg,
                          border: `1px solid ${imp.border}`,
                          color: imp.color,
                          padding: "2px 7px",
                          borderRadius: 3,
                        }}
                      >
                        {imp.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            {p.genes
              .filter((g) => g.activity === 1 && g.variants.length === 0)
              .map((g) => (
                <div
                  key={g.name}
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#94A3B8",
                      width: 80,
                      flexShrink: 0,
                    }}
                  >
                    {g.name}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      gap: 3,
                      alignItems: "center",
                    }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: 12,
                          flex: 1,
                          borderRadius: 3,
                          background: i < 8 ? "#10B981" : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#10B981",
                        width: 80,
                      }}
                    >
                      Normal
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        background: "#F0FDF4",
                        border: "1px solid #A7F3D0",
                        color: "#065F46",
                        padding: "2px 7px",
                        borderRadius: 3,
                      }}
                    >
                      Normal Function
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 11, color: "#94A3B8" }}>
            PharmaGuard · RIFT 2026 HealthTech Track · AI-assisted Precision
            Medicine Prototype
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#CBD5E1",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Report ID: RPT-{1000} · {p.analysisDate}
          </div>
        </div>
      </div>
    </div>
  );
}
