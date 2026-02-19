import React from "react";

function Header({ borderCls, dark, accentCls, mutedCls, setDark }) {
  return (
    <>
      <header
        className={`sticky top-0 z-20 flex items-center gap-4 px-8 py-4 border-b ${borderCls} backdrop-blur-xl transition-colors duration-300`}
        style={{
          background: dark ? "rgba(5,11,16,0.88)" : "rgba(240,247,255,0.88)",
        }}
      >
        {/* Logo */}
        <div
          className={`w-9 h-9 rounded-xl border-[1.5px] flex items-center justify-center shrink-0 ${dark ? "border-cyan-500 bg-cyan-500/10" : "border-sky-400 bg-sky-400/10"}`}
        >
          <span
            className={`syne text-xs font-black tracking-tighter ${accentCls}`}
          >
            PG
          </span>
        </div>

        <div>
          <p className="syne text-[15px] font-bold m-0 leading-tight">
            PharmacogenomicAI
          </p>
          <p
            className={`text-[10px] uppercase tracking-[0.16em] m-0 ${mutedCls}`}
          >
            Genetic Drug Analysis
          </p>
        </div>

        {/* Status */}
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.75 h-1.75 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span
            className={`text-[11px] uppercase tracking-[0.14em] ${mutedCls}`}
          >
            Online
          </span>
        </div>

        {/* Speaking pill
          {speaking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10">
              <span className="text-sm">👨‍⚕️</span>
              <span className="text-[11px] text-cyan-400 animate-pulse">
                Speaking…
              </span>
            </div>
          )} */}

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`relative w-13 h-7 rounded-full border-[1.5px] cursor-pointer transition-colors duration-300 ${
            dark
              ? "bg-[#0e2030] border-[#1e3a50]"
              : "bg-slate-200 border-slate-300"
          }`}
        >
          <div
            className={`absolute top-0.75 w-5 h-5 rounded-full flex items-center justify-center text-[11px] transition-all duration-300 ${
              dark
                ? "left-6.75 bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                : "left-0.75  bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            }`}
          >
            {dark ? "🌙" : "☀️"}
          </div>
        </button>
      </header>
    </>
  );
}

export default Header;
