from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

from vcf_parser import parse_vcf
from rules import cyp2c19, cyp2d6, cyp2c9, slco1b1, tpmt, dpyd
from cpic_guidelines import clopidogrel_recommendation, warfarin_recommendation


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= GENE MAP =================
gene_map = {
    "CLOPIDOGREL": ("CYP2C19", cyp2c19),
    "CODEINE": ("CYP2D6", cyp2d6),
    "WARFARIN": ("CYP2C9", cyp2c9),
    "SIMVASTATIN": ("SLCO1B1", slco1b1),
    "AZATHIOPRINE": ("TPMT", tpmt),
    "FLUOROURACIL": ("DPYD", dpyd)
}


# ================= CPIC ENGINE =================
def get_clinical_recommendation(drug, phenotype):
    if drug == "CLOPIDOGREL":
        return clopidogrel_recommendation(phenotype)

    if drug == "WARFARIN":
        return warfarin_recommendation(phenotype)

    return {
        "prescribing_action": "No CPIC guideline available",
        "monitoring": "",
        "alternative_therapy": ""
    }


# ================= SINGLE DRUG =================
@app.post("/drug-risk")
async def drug_risk(file: UploadFile = File(...), drug: str = Form(...)):

    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    variants = parse_vcf(temp_path)
    os.remove(temp_path)

    drug = drug.upper()

    if drug not in gene_map:
        return {"error": "Unsupported drug"}

    gene, func = gene_map[drug]
    gene_vars = [v for v in variants if v["gene"] == gene]

    if len(gene_vars) == 0:
        return {
            "drug": drug,
            "gene": gene,
            "phenotype": "Unknown",
            "risk": "Unknown",
            "severity": "low",
            "variants": []
        }

    phenotype, risk, severity = func(gene_vars)

    # 🔥 CPIC recommendation
    clinical = get_clinical_recommendation(drug, phenotype)

    return {
        "patient_id": "PATIENT_001",
        "drug": drug,
        "timestamp": datetime.utcnow().isoformat(),

        "risk_assessment": {
            "risk_label": risk,
            "confidence_score": 0.95 if phenotype != "Unknown" else 0.4,
            "severity": severity
        },

        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": "/".join([v["star"] for v in gene_vars]),
            "phenotype": phenotype,
            "detected_variants": gene_vars
        },

        "clinical_recommendation": clinical,

        "llm_generated_explanation": {
            "summary": "",
            "mechanism": "",
            "clinical_impact": "",
            "recommendation": "",
            "evidence_level": ""
        },

        "quality_metrics": {
            "vcf_parsing_success": True,
            "gene_detected": True
        }
    }


# ================= MULTI DRUG =================
@app.post("/batch-risk")
async def batch_risk(file: UploadFile = File(...), drugs: str = Form(...)):

    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    variants = parse_vcf(temp_path)
    os.remove(temp_path)

    drug_list = [d.strip().upper() for d in drugs.split(",")]

    results = []

    for drug in drug_list:

        if drug not in gene_map:
            results.append({"drug": drug, "error": "Unsupported drug"})
            continue

        gene, func = gene_map[drug]
        gene_vars = [v for v in variants if v["gene"] == gene]

        if len(gene_vars) == 0:
            results.append({
                "drug": drug,
                "gene": gene,
                "phenotype": "Unknown",
                "risk": "Unknown",
                "severity": "low",
                "variants": []
            })
            continue

        phenotype, risk, severity = func(gene_vars)
        clinical = get_clinical_recommendation(drug, phenotype)

        results.append({
            "drug": drug,
            "gene": gene,
            "phenotype": phenotype,
            "risk": risk,
            "severity": severity,
            "variants": gene_vars,
            "clinical_recommendation": clinical
        })

    return {"results": results}
