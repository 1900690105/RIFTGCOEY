"use client";
import { useState, useRef, useEffect } from "react";
import DoctorAvatar from "./components/DoctorAvatar";
import Header from "./components/Header";
import DoctorAssistant from "./components/DoctorAssistant";

export default function Home() {
  const [file, setFile] = useState(null);
  const [drug, setDrug] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dark, setDark] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const [summary, setSummary] = useState("");

  const normalizedReports = Array.isArray(result)
    ? result
    : result
      ? [result]
      : [];

  const reports = normalizedReports;

  function riskConfig(label) {
    switch (label) {
      case "Safe":
        return {
          card: dark
            ? "border-emerald-500 bg-emerald-950/60"
            : "border-emerald-500 bg-emerald-50",
          badge: dark
            ? "border-emerald-500/50 bg-emerald-950"
            : "border-emerald-400 bg-emerald-100",
          text: dark ? "text-emerald-400" : "text-emerald-700",
          icon: "🟢",
        };
      case "Adjust Dosage":
        return {
          card: dark
            ? "border-amber-500 bg-amber-950/60"
            : "border-amber-500 bg-amber-50",
          badge: dark
            ? "border-amber-500/50 bg-amber-950"
            : "border-amber-400 bg-amber-100",
          text: dark ? "text-amber-400" : "text-amber-700",
          icon: "🟡",
        };
      case "Ineffective":
      case "Toxic":
        return {
          card: dark
            ? "border-red-500 bg-red-950/60"
            : "border-red-500 bg-red-50",
          badge: dark
            ? "border-red-500/50 bg-red-950"
            : "border-red-400 bg-red-100",
          text: dark ? "text-red-400" : "text-red-700",
          icon: "🔴",
        };
      default:
        return {
          card: dark
            ? "border-slate-600 bg-slate-800/60"
            : "border-slate-400 bg-slate-100",
          badge: dark
            ? "border-slate-600/50 bg-slate-800"
            : "border-slate-400 bg-slate-200",
          text: dark ? "text-slate-400" : "text-slate-600",
          icon: "⚪",
        };
    }
  }

  async function speakExplanation(text) {
    if (!text) return;

    await new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) return resolve();
      speechSynthesis.onvoiceschanged = resolve;
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google") || v.name.includes("Microsoft"),
    );

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    speechSynthesis.cancel(); // prevents double talking
    speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (reports.length > 0 && reports[0]?.llm_generated_explanation?.summary) {
      speakExplanation(reports[0].llm_generated_explanation.summary);
    }
  }, [result]);

  const SUPPORTED_DRUGS = [
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL",
  ];

  async function validateVCF(file) {
    // 1️⃣ Extension check
    if (!file.name.toLowerCase().endsWith(".vcf"))
      return "Only .vcf files are allowed";

    // 2️⃣ Size check
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";

    // 3️⃣ Read file content
    const text = await file.text();

    // 4️⃣ Check VCF version
    if (!text.includes("##fileformat=VCFv4.2"))
      return "VCF must be version 4.2";

    // 5️⃣ Check required INFO tags
    const requiredTags = ["GENE=", "STAR=", "RS="];
    const hasTags = requiredTags.every((tag) => text.includes(tag));
    if (!hasTags) return "VCF missing required INFO fields (GENE, STAR, RS)";

    // 6️⃣ Check at least one variant row
    const variantLines = text
      .split("\n")
      .filter((line) => !line.startsWith("#") && line.trim());
    if (variantLines.length === 0) return "VCF contains no variant records";

    return null;
  }

  async function handleSubmit() {
    if (!file || !drug) return;
    const normalizedDrug = drug.toUpperCase().trim();

    // Drug validation
    if (!SUPPORTED_DRUGS.includes(normalizedDrug)) {
      alert(
        `Unsupported drug.\nSupported drugs:\n${SUPPORTED_DRUGS.join(", ")}`,
      );
      return;
    }

    // File validation
    const error = await validateVCF(file);
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("drug", drug);
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      setResult(data);
      console.log(data);
      setSummary(data.llm_generated_explanation.summary);
    } catch {
      setResult({ error: "Analysis failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `PGx_Report_${drug || "drug"}_${now}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Shared theme shortcuts ──
  const borderCls = dark ? "border-slate-800" : "border-slate-200";
  const surfaceCls = dark ? "bg-[#0b1318]" : "bg-white";
  const mutedCls = dark ? "text-slate-500" : "text-slate-500";
  const accentCls = dark ? "text-cyan-400" : "text-sky-500";
  const dimCls = dark ? "text-slate-700" : "text-slate-400";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        body { font-family: 'DM Mono', monospace; }
        .syne { font-family: 'Syne', sans-serif; }
        .dmm  { font-family: 'DM Mono', monospace; }
        @keyframes spinR { to { transform: rotate(-360deg); } }
        .animate-spin-r { animation: spinR 1.5s linear infinite; }
        @keyframes barPulse { 0%,100%{height:10px}50%{height:28px} }
        .bar-pulse { animation: barPulse .8s ease-in-out infinite; }
        details summary::-webkit-details-marker { display:none; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#1e3040; border-radius:4px; }
      `}</style>

      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${dark ? "text-slate-100" : "text-slate-900"}`}
        style={{
          fontFamily: "'DM Mono', monospace",
          background: dark
            ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,255,0.07) 0%, transparent 60%), #050b10"
            : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.08) 0%, transparent 60%), #f0f7ff",
        }}
      >
        {/* ── HEADER ── */}
        <Header
          borderCls={borderCls}
          dark={dark}
          accentCls={accentCls}
          mutedCls={mutedCls}
          setDark={setDark}
        />

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── SIDEBAR ── */}
          <aside
            className={`w-100 shrink-0 border-r ${borderCls} flex flex-col gap-8 p-8 overflow-y-auto transition-colors duration-300`}
          >
            {/* Step 1 — Upload */}
            <section>
              <StepLabel
                num="1"
                label="Genomic File"
                dark={dark}
                accentCls={accentCls}
                borderCls={borderCls}
                mutedCls={mutedCls}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                  file
                    ? dark
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-emerald-500 bg-emerald-50"
                    : dragOver
                      ? dark
                        ? "border-cyan-400   bg-cyan-400/5"
                        : "border-sky-400   bg-sky-50"
                      : dark
                        ? "border-slate-700 hover:border-slate-500"
                        : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <div className="text-3xl mb-3">✅</div>
                    <p className="text-sm font-medium text-emerald-400 break-all mb-1">
                      {file.name}
                    </p>
                    <p className={`text-[11px] ${mutedCls}`}>
                      {(file.size / 1024).toFixed(1)} KB · Click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-3">🧬</div>
                    <p
                      className={`text-sm mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Drop genomic file here
                    </p>
                    <p className={`text-[11px] ${mutedCls}`}>
                      VCF · FASTQ · CSV · or click to browse
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* Step 2 — Drug */}
            <section>
              <StepLabel
                num="2"
                label="Drug Selection"
                dark={dark}
                accentCls={accentCls}
                borderCls={borderCls}
                mutedCls={mutedCls}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none">
                  💊
                </span>
                <input
                  type="text"
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  placeholder="e.g. Warfarin, Clopidogrel…"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 dmm ${
                    dark
                      ? "bg-[#0b1318] border-slate-700 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
                  }`}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Warfarin",
                  "Clopidogrel",
                  "Simvastatin",
                  "Codeine",
                  "Tamoxifen",
                  "FLUOROURACIL",
                ].map((name) => (
                  <button
                    key={name}
                    onClick={() => setDrug(name)}
                    className={`text-[11px] px-3 py-1 rounded-full border cursor-pointer dmm transition-all duration-200 ${
                      drug === name
                        ? dark
                          ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-400"
                          : "border-sky-400/60 bg-sky-400/15 text-sky-600"
                        : dark
                          ? "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                          : "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3 — Run */}
            <section>
              <StepLabel
                num="3"
                label="Run Analysis"
                dark={dark}
                accentCls={accentCls}
                borderCls={borderCls}
                mutedCls={mutedCls}
              />
              <button
                onClick={handleSubmit}
                disabled={!file || !drug || loading}
                className={`w-full py-3.5 rounded-2xl text-sm font-semibold tracking-wide dmm flex items-center justify-center gap-2 border-none transition-all duration-200 ${
                  !file || !drug || loading
                    ? dark
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : dark
                      ? "bg-cyan-400 text-[#050b10] cursor-pointer shadow-[0_0_28px_rgba(0,212,255,0.35)] hover:bg-cyan-300"
                      : "bg-sky-500  text-white    cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:bg-sky-400"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.2"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  "⚡ Run Genomic Analysis"
                )}
              </button>
              {(!file || !drug) && (
                <p className={`text-[11px] text-center mt-2 ${dimCls}`}>
                  {!file
                    ? "Upload a genomic file to continue"
                    : "Enter a drug name to continue"}
                </p>
              )}
            </section>

            <div className="flex justify-center my-6">
              <DoctorAvatar speaking={speaking} />
            </div>

            <DoctorAssistant report={result} onSpeak={speakExplanation} />

            {/* Supported genes */}
            <div
              className={`rounded-2xl border p-4 ${borderCls} ${dark ? "bg-slate-900/60" : "bg-slate-50/80"}`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.18em] mb-3 ${mutedCls}`}
              >
                Supported Genes
              </p>
              <div className="flex flex-wrap gap-2">
                {["CYP2C9", "CYP2C19", "CYP2D6", "VKORC1", "DPYD", "TPMT"].map(
                  (g) => (
                    <span
                      key={g}
                      className={`text-[11px] px-2.5 py-0.5 rounded-md border ${
                        dark
                          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                          : "border-sky-400/25 bg-sky-400/10 text-sky-600"
                      }`}
                    >
                      {g}
                    </span>
                  ),
                )}
              </div>
            </div>
          </aside>

          {/* ── RESULT PANEL ── */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Empty state */}
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10">
                <div
                  className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-4xl ${borderCls} ${dark ? "bg-slate-900/60" : "bg-slate-50/80"}`}
                >
                  🧬
                </div>
                <div className="text-center">
                  <p className={`text-sm mb-1.5 ${mutedCls}`}>
                    No analysis yet
                  </p>
                  <p className={`text-xs ${dimCls}`}>
                    Configure your inputs in the sidebar to begin
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm opacity-30 mt-3">
                  {[
                    "Gene Interaction",
                    "Metabolism Rate",
                    "Risk Score",
                    "Allele Freq.",
                    "Drug Response",
                    "CYP Profile",
                  ].map((label) => (
                    <div
                      key={label}
                      className={`rounded-xl border p-3.5 text-center ${borderCls} ${dark ? "bg-slate-900/50" : "bg-slate-50/80"}`}
                    >
                      <div
                        className={`h-1.5 w-10 rounded mx-auto mb-2 ${dark ? "bg-slate-800" : "bg-slate-300"}`}
                      />
                      <p className={`text-[10px] ${dimCls}`}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative w-16 h-16">
                  <svg
                    className="animate-spin absolute inset-0 w-full h-full"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={dark ? "#1a2e3b" : "#e2e8f0"}
                      strokeWidth="2"
                    />
                    <path
                      d="M32 4 A28 28 0 0 1 60 32"
                      stroke={dark ? "#00d4ff" : "#0ea5e9"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <svg
                    className="animate-spin-r absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M24 4 A20 20 0 0 0 4 24"
                      stroke={
                        dark ? "rgba(0,212,255,0.4)" : "rgba(14,165,233,0.4)"
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Processing genomic data…
                  </p>
                  <p className={`text-[11px] ${mutedCls}`}>
                    Analyzing <em>{drug}</em> interactions
                  </p>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bar-pulse w-1 rounded-sm"
                      style={{
                        background: dark ? "#00d4ff" : "#0ea5e9",
                        opacity: 0.75,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="flex-1 overflow-y-auto p-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <h2 className="syne text-2xl font-bold mb-1.5">
                      Analysis Complete
                    </h2>
                    <p className={`text-[11px] m-0 ${mutedCls}`}>
                      Drug: <span className={accentCls}>{drug}</span>
                      {" · "}
                      File:{" "}
                      <span
                        className={dark ? "text-slate-400" : "text-slate-600"}
                      >
                        {file?.name}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setResult(null);
                      setFile(null);
                      setDrug("");
                    }}
                    className={`text-[11px] px-3.5 py-1.5 rounded-lg border cursor-pointer bg-transparent dmm transition-all duration-200 ${
                      dark
                        ? "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                        : "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    ✕ Clear
                  </button>
                </div>

                {/* Error */}
                {result?.error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/8 px-5 py-4 flex items-center gap-3 mb-6">
                    <span className="text-lg">⚠️</span>
                    <p className="text-sm text-red-400 m-0">{result.error}</p>
                  </div>
                )}

                {/* Summary strip */}
                {reports.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mb-5">
                    {reports.map((r, i) => {
                      const rc = riskConfig(r.risk_assessment?.risk_label);
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${rc.badge} ${rc.text}`}
                        >
                          <span>{rc.icon}</span>
                          <span className="font-semibold">{r.drug}</span>
                          <span className="opacity-50">·</span>
                          <span className="opacity-80">
                            {r.risk_assessment?.risk_label ?? "Unknown"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Clinical drug cards */}
                {reports.length > 0 && (
                  <div className="flex flex-col gap-4 mb-7">
                    {reports.map((r, i) => {
                      const rc = riskConfig(r.risk_assessment?.risk_label);
                      const profile = r.pharmacogenomic_profile ?? {};
                      const risk = r.risk_assessment ?? {};
                      const explain = r.llm_generated_explanation ?? {};
                      const metrics = risk.metrics ?? {};

                      return (
                        <div
                          key={i}
                          className={`rounded-2xl border-[1.5px] overflow-hidden transition-shadow duration-200 hover:shadow-xl ${rc.card}`}
                        >
                          {/* Card header */}
                          <div className="flex justify-between items-start p-5 pb-4 border-b border-white/5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{rc.icon}</span>
                                <h3
                                  className={`syne text-lg font-bold m-0 ${rc.text}`}
                                >
                                  {r.drug ?? `Drug ${i + 1}`}
                                </h3>
                              </div>
                              <p className={`text-xs m-0 ${mutedCls}`}>
                                {profile.primary_gene && (
                                  <span className={`${rc.text} opacity-80`}>
                                    {profile.primary_gene}
                                  </span>
                                )}
                                {profile.phenotype && (
                                  <span className={mutedCls}>
                                    {" "}
                                    ·{" "}
                                    <span className={`${rc.text} opacity-80`}>
                                      {profile.phenotype}
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                            <div
                              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${rc.badge} ${rc.text}`}
                            >
                              {risk.risk_label ?? "Unknown"}
                            </div>
                          </div>

                          {/* Metric chips */}
                          {Object.keys(metrics).length > 0 && (
                            <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/5">
                              {Object.entries(metrics).map(([k, v]) => (
                                <span
                                  key={k}
                                  className={`text-[11px] px-2.5 py-0.5 rounded-md border ${
                                    dark
                                      ? "bg-white/5 border-white/10"
                                      : "bg-black/4 border-black/10"
                                  } ${mutedCls}`}
                                >
                                  <span className={`font-semibold ${rc.text}`}>
                                    {k.replace(/_/g, " ")}:{" "}
                                  </span>
                                  {String(v)}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Expandable explanation */}
                          <details className="px-5">
                            <summary
                              className={`flex items-center gap-2 py-3 text-sm cursor-pointer select-none list-none ${rc.text}`}
                            >
                              <span
                                className={`inline-flex items-center justify-center w-4.5 h-4.5 rounded border text-[10px] border-current/40 ${rc.text}`}
                              >
                                ▸
                              </span>
                              Clinical Explanation
                            </summary>
                            <div className="pb-5 flex flex-col gap-3">
                              {[
                                { label: "Summary", val: explain.summary },
                                { label: "Mechanism", val: explain.mechanism },
                                {
                                  label: "Recommendation",
                                  val: explain.recommendation,
                                },
                                {
                                  label: "Alternatives",
                                  val: explain.alternatives,
                                },
                              ]
                                .filter((x) => x.val)
                                .map(({ label, val }) => (
                                  <div
                                    key={label}
                                    className={`rounded-xl border p-3.5 ${dark ? "bg-black/20 border-white/5" : "bg-white/60 border-black/5"}`}
                                  >
                                    <p
                                      className={`text-[10px] uppercase tracking-[0.16em] mb-1.5 ${mutedCls}`}
                                    >
                                      {label}
                                    </p>
                                    <p
                                      className={`text-[13px] leading-relaxed m-0 ${dark ? "text-slate-200" : "text-slate-700"}`}
                                    >
                                      {val}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </details>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Fallback: non-array result */}
                {!result?.error && reports.length === 0 && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5 mb-7">
                    {Object.entries(result)
                      .slice(0, 6)
                      .map(([key, val]) => (
                        <div
                          key={key}
                          className={`rounded-2xl border p-4 transition-colors duration-200 ${borderCls} ${surfaceCls} ${
                            dark
                              ? "hover:border-cyan-500/50"
                              : "hover:border-sky-400/50"
                          }`}
                        >
                          <p
                            className={`text-[10px] uppercase tracking-[0.16em] mb-1.5 ${mutedCls}`}
                          >
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm font-medium m-0 truncate">
                            {String(val)}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                <div className="flex gap-5">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs mb-6 dmm cursor-pointer bg-transparent transition-all duration-200 ${
                      copied
                        ? "border-emerald-500 text-emerald-400"
                        : dark
                          ? "border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-400"
                          : "border-slate-300 text-slate-500 hover:border-sky-400 hover:text-sky-500"
                    }`}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy JSON Report"}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!result}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs mb-6 dmm transition-all duration-200 ${
                      !result
                        ? "border-slate-700 text-slate-600 cursor-not-allowed"
                        : dark
                          ? "border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                          : "border-sky-400 text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    ⬇️ Download JSON Report
                  </button>
                </div>

                {/* JSON terminal */}
                <div>
                  <div
                    className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] mb-3 ${mutedCls}`}
                  >
                    Raw Output
                    <span
                      className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-200"}`}
                    />
                  </div>
                  <div
                    className={`rounded-2xl border overflow-hidden ${borderCls}`}
                    style={{ background: dark ? "#070e13" : "#f8fafc" }}
                  >
                    <div
                      className={`flex justify-between items-center gap-1.5 px-4 py-2.5 border-b ${borderCls} ${dark ? "bg-[#0b1318]" : "bg-slate-100"}`}
                    >
                      <div>
                        {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                          <span
                            key={c}
                            className="w-2.5 h-2.5 rounded-full opacity-70"
                            style={{ background: c }}
                          />
                        ))}
                        <span className={`text-[10px] ml-2 ${mutedCls}`}>
                          response.json
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10">
                        <span className="text-sm">👨‍⚕️</span>
                        <button
                          onClick={() => {
                            speakExplanation(summary || "can not find");
                          }}
                          className="text-[11px] text-cyan-400 animate-pulse"
                        >
                          Speak
                        </button>
                      </div>
                    </div>
                    <pre
                      className={`p-5 overflow-x-auto text-xs leading-relaxed m-0 dmm whitespace-pre-wrap wrap-break-word ${
                        dark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function StepLabel({ num, label, dark, accentCls, borderCls, mutedCls }) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] mb-3.5 ${mutedCls}`}
    >
      <span
        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${borderCls} ${accentCls}`}
      >
        {num}
      </span>
      {label}
      <span
        className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-200"}`}
      />
    </div>
  );
}
