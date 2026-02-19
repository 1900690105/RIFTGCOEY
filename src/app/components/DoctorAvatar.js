"use client";
import { useEffect, useState } from "react";

export default function DoctorAvatar({ speaking }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!speaking) return;
    const i = setInterval(() => setPulse((p) => !p), 420);
    return () => clearInterval(i);
  }, [speaking]);

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {/* OUTER AUDIO RINGS */}
      {speaking && (
        <>
          <div className="absolute w-full h-full rounded-full border border-cyan-400/30 animate-ping" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-400/40 animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-cyan-400/60" />
        </>
      )}

      {/* CORE GLOW */}
      <div
        className={`absolute w-28 h-28 rounded-full blur-2xl transition-all duration-300 ${
          speaking ? "bg-cyan-400/30 scale-110" : "bg-slate-500/10 scale-100"
        }`}
      />

      {/* AVATAR */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-linear-to-br from-slate-200 to-slate-400 flex items-center justify-center text-4xl shadow-xl">
        🧑‍⚕️
      </div>

      {/* SPEAKING DOTS */}
      {speaking && (
        <div className="absolute -bottom-6 flex gap-1">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:.15s]" />
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:.3s]" />
        </div>
      )}
    </div>
  );
}
