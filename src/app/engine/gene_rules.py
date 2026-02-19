CYP2C19_RULES = [
    {"name": "*2", "chr": "10", "pos": 96541616, "alt": "A"},
    {"name": "*3", "chr": "10", "pos": 96540410, "alt": "A"},
    {"name": "*17","chr": "10", "pos": 96672914, "alt": "T"},
]

def detect_cyp2c19(variants):
    found = []

    for v in variants:
        for rule in CYP2C19_RULES:

            chrom_match = v["chrom"] == rule["chr"]
            pos_match = int(v["pos"]) == int(rule["pos"])
            alt_match = v["alt"].upper() == rule["alt"].upper()

            if chrom_match and pos_match and alt_match:
                found.append(rule["name"])

    return found

