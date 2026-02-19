import React from "react";

export default function PharmaReport({ data }) {
  if (!data) return null;

  const riskColor =
    data.risk_assessment.severity === "high"
      ? "bg-red-100 text-red-700 border-red-300"
      : data.risk_assessment.severity === "moderate"
        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
        : "bg-green-100 text-green-700 border-green-300";

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border">
          <h1 className="text-2xl font-bold text-medical">
            Pharmacogenomic Drug Report
          </h1>
          <p className="text-gray-500 mt-1">Patient: {data.patient_id}</p>
          <p className="text-gray-400 text-sm">
            Generated: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>

        {/* RISK SUMMARY */}
        <div className={`border rounded-2xl p-6 ${riskColor}`}>
          <h2 className="text-xl font-semibold">Risk Assessment</h2>
          <p className="text-lg mt-2">
            Drug: <b>{data.drug}</b>
          </p>
          <p className="mt-1">
            Risk: <b>{data.risk_assessment.risk_label}</b>
          </p>
          <p className="mt-1">
            Confidence:{" "}
            {(data.risk_assessment.confidence_score * 100).toFixed(0)}%
          </p>
        </div>

        {/* GENETIC PROFILE */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-medical">
            Genetic Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Info
              label="Gene"
              value={data.pharmacogenomic_profile.primary_gene}
            />
            <Info
              label="Diplotype"
              value={data.pharmacogenomic_profile.diplotype}
            />
            <Info
              label="Phenotype"
              value={data.pharmacogenomic_profile.phenotype}
            />
          </div>

          {/* Variants Table */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Detected Variants</h3>
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">RSID</th>
                  <th className="p-2 text-left">Star</th>
                  <th className="p-2 text-left">Chromosome</th>
                  <th className="p-2 text-left">Position</th>
                </tr>
              </thead>
              <tbody>
                {data.pharmacogenomic_profile.detected_variants.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{v.rsid}</td>
                    <td className="p-2">{v.star}</td>
                    <td className="p-2">{v.chrom}</td>
                    <td className="p-2">{v.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CLINICAL RECOMMENDATION */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-medical mb-3">
            Clinical Recommendation
          </h2>

          <Card
            title="Prescribing Action"
            text={data.clinical_recommendation.prescribing_action}
          />
          <Card
            title="Monitoring"
            text={data.clinical_recommendation.monitoring}
          />
          <Card
            title="Alternative Therapy"
            text={data.clinical_recommendation.alternative_therapy}
          />
        </div>

        {/* AI EXPLANATION */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-medical mb-3">
            AI Clinical Explanation
          </h2>

          <Explain
            title="Summary"
            text={data.llm_generated_explanation.summary}
          />
          <Explain
            title="Mechanism"
            text={data.llm_generated_explanation.mechanism}
          />
          <Explain
            title="Clinical Impact"
            text={data.llm_generated_explanation.clinical_impact}
          />
          <Explain
            title="Recommendation"
            text={data.llm_generated_explanation.recommendation}
          />
          <Explain
            title="Evidence Level"
            text={data.llm_generated_explanation.evidence_level}
          />
        </div>
      </div>
    </div>
  );
}

/* Small Components */

function Info({ label, value }) {
  return (
    <div className="border rounded-lg p-3 bg-slate-50">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="mb-3">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}

function Explain({ title, text }) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-slate-700">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
