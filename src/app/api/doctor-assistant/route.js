import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function POST(req) {
  try {
    const { question, report } = await req.json();

    if (!question)
      return NextResponse.json({ error: "Question required" }, { status: 400 });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a clinical pharmacogenomics assistant helping a DOCTOR.

Patient pharmacogenomic report:
${JSON.stringify(report, null, 2)}

Doctor question:
"${question}"

Give a short clinical answer (NOT general advice, NOT disclaimer).
Explain mechanism if needed.
`;

    const result = await model.generateContent(prompt);

    // 🧠 SAFE EXTRACTION
    let text = "";

    try {
      text =
        result.response?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .join("") ||
        result.response?.text() ||
        "";
    } catch {}

    if (!text || text.trim().length < 5) {
      return NextResponse.json({
        answer:
          "I could not confidently generate a clinical answer. Please rephrase the question.",
      });
    }

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: "AI assistant failed" }, { status: 500 });
  }
}
