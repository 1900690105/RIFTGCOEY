import React from "react";

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

function Sidebar({ dark, borderCls, accentCls, mutedCls }) {
  return (
    <>
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

        <DoctorAvatar speaking={speaking} loading={loading} dark={dark} />

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
    </>
  );
}

export default Sidebar;
