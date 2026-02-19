TARGET_GENES = {"CYP2D6","CYP2C19","CYP2C9","SLCO1B1","TPMT","DPYD"}

from gene_lookup import RSID_GENE_MAP



def parse_info(info_str):
    info = {}
    for field in info_str.split(";"):
        if "=" in field:
            k, v = field.split("=", 1)
            info[k] = v
    return info

def parse_vcf(path):
    variants = []

    with open(path) as f:
        for line in f:
            if line.startswith("#"):
                continue

            cols = line.strip().split()
            if len(cols) < 8:
                continue

            chrom = cols[0]
            pos = int(cols[1])
            rsid = cols[2]
            ref = cols[3]
            alt = cols[4]
            info_str = cols[7]

            info = parse_info(info_str)

            # IMPORTANT PART
            if "GENE" in info and "STAR" in info:
                variants.append({
                    "gene": info["GENE"],
                    "rsid": rsid,
                    "star": info["STAR"],
                    "chrom": chrom,
                    "pos": pos
                })

    return variants
