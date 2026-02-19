# ================= CYP2C19 =================
def cyp2c19(variants):
    stars = [v["star"] for v in variants]

    if "*2" in stars or "*3" in stars:
        return "PM", "Ineffective", "high"

    if "*17" in stars:
        return "RM", "Safe", "low"

    return "NM", "Safe", "none"


# ================= CYP2C9 =================
def cyp2c9(variants):
    stars = [v["star"] for v in variants]

    if "*2" in stars or "*3" in stars:
        return "IM", "Adjust Dosage", "moderate"

    return "NM", "Safe", "none"


# ================= CYP2D6 =================
def cyp2d6(variants):
    stars = [v["star"] for v in variants]

    if "*4" in stars:
        return "PM", "Toxic", "critical"

    return "NM", "Safe", "none"


# ================= SLCO1B1 =================
def slco1b1(variants):
    stars = [v["star"] for v in variants]

    if "*5" in stars:
        return "IM", "Adjust Dosage", "moderate"

    return "NM", "Safe", "none"


# ================= TPMT =================
def tpmt(variants):
    stars = [v["star"] for v in variants]

    if "*3C" in stars:
        return "PM", "Toxic", "critical"

    return "NM", "Safe", "none"


# ================= DPYD =================
def dpyd(variants):
    stars = [v["star"] for v in variants]

    if "*2A" in stars:
        return "PM", "Toxic", "critical"

    return "NM", "Safe", "none"
