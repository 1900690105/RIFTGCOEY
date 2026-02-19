"use client";
import { useState, useRef } from "react";

export default function DoctorAssistant({ report, onSpeak }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [reply, setReply] = useState("");
  const [listening, setListening] = useState(false);

  // ----------- MIC INPUT -----------
  const startMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Mic not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQuestion(text);
      askAI(text);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ----------- ASK GEMINI -----------
  async function askDoctorAI() {
    if (!question.trim()) return;

    setReply("Thinking...");

    const res = await fetch("/api/doctor-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, report }),
    });

    const data = await res.json();
    setReply(data.answer || "No response from AI");
    if (data.answer) {
      onSpeak(data.answer);
    }
  }

  return (
    <div className="mt-6 bg-slate-900 border border-cyan-400/20 rounded-xl p-4">
      <h2 className="text-cyan-300 font-semibold mb-3">
        Ask Clinical Assistant
      </h2>

      <div className="w-full max-w-xl mt-8 space-y-3">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask clinical question about this report..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm"
          />

          <button
            onClick={startMic}
            className={`px-4 rounded-xl ${
              listening ? "bg-red-500" : "bg-slate-700"
            }`}
          >
            🎙
          </button>

          <button
            onClick={askDoctorAI}
            className="px-5 rounded-xl bg-cyan-400 text-black font-semibold"
          >
            Ask
          </button>
        </div>

        {reply && (
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-sm whitespace-pre-wrap">
            {reply}
          </div>
        )}
      </div>

      {loading && (
        <p className="text-xs text-slate-400 mt-2">Thinking clinically...</p>
      )}
    </div>
  );
}
