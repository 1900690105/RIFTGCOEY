import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Send to Python engine
    const backendRes = await fetch(
      "https://rift-gcoey-backend.onrender.com/drug-risk",
      {
        method: "POST",
        body: formData,
      },
    );

    const pgx = await backendRes.json();

    if (pgx.error) {
      return Response.json(pgx);
    }

    // ---------------- Gemini ----------------
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a clinical pharmacogenomics decision support system.

Explain the result for a doctor.

Drug: ${pgx.drug}
Gene: ${pgx.pharmacogenomic_profile.primary_gene}
Diplotype: ${pgx.pharmacogenomic_profile.diplotype}
Phenotype: ${pgx.pharmacogenomic_profile.phenotype}
Risk: ${pgx.risk_assessment.risk_label}

Medical Recommendation:
${pgx.clinical_recommendation.prescribing_action}

Write structured output EXACTLY in format:

SUMMARY:
BIOLOGICAL_MECHANISM:
CLINICAL_IMPACT:
RECOMMENDATION_RATIONALE:
EVIDENCE_LEVEL:
`;

    const ai = await model.generateContent(prompt);
    const text = ai.response.text();

    function section(name) {
      const r = new RegExp(name + ":(.*?)(?=\\n[A-Z_]+:|$)", "s");
      const m = text.match(r);
      return m ? m[1].trim() : "";
    }

    pgx.llm_generated_explanation = {
      summary: section("SUMMARY"),
      mechanism: section("BIOLOGICAL_MECHANISM"),
      clinical_impact: section("CLINICAL_IMPACT"),
      recommendation: section("RECOMMENDATION_RATIONALE"),
      evidence_level: section("EVIDENCE_LEVEL"),
    };

    return Response.json(pgx);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI processing failed" }, { status: 500 });
  }
}
