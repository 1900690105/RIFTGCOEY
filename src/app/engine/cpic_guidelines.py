def clopidogrel_recommendation(phenotype):
    if phenotype == "PM":
        return {
            "prescribing_action": "Avoid clopidogrel. Use prasugrel or ticagrelor.",
            "monitoring": "High risk of stent thrombosis due to lack of platelet inhibition.",
            "alternative_therapy": "Prasugrel or Ticagrelor preferred."
        }

    if phenotype == "IM":
        return {
            "prescribing_action": "Consider alternative therapy or higher dose.",
            "monitoring": "Reduced platelet inhibition possible.",
            "alternative_therapy": "Prasugrel or Ticagrelor."
        }

    return {
        "prescribing_action": "Use standard dosing.",
        "monitoring": "Routine cardiovascular monitoring.",
        "alternative_therapy": "Not required."
    }


def warfarin_recommendation(phenotype):
    if phenotype in ["IM","PM"]:
        return {
            "prescribing_action": "Reduce starting dose.",
            "monitoring": "Frequent INR monitoring required.",
            "alternative_therapy": "Consider DOAC."
        }

    return {
        "prescribing_action": "Standard dosing.",
        "monitoring": "Routine INR monitoring.",
        "alternative_therapy": "None"
    }
