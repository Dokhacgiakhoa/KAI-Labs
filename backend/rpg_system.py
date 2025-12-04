from datetime import datetime
import math

# --- CONFIGURATION ---

# Monthly Natural Growth Table (Points per Month)
GROWTH_TABLE = [
    {"min_age": 0, "max_age": 9, "str": 10, "agi": 10, "int": 20, "chr": 10, "sta": 10},
    {"min_age": 10, "max_age": 19, "str": 20, "agi": 30, "int": 20, "chr": 20, "sta": 20},
    {"min_age": 20, "max_age": 29, "str": 40, "agi": 40, "int": 30, "chr": 30, "sta": 40},
    {"min_age": 30, "max_age": 39, "str": 30, "agi": 20, "int": 40, "chr": 30, "sta": 30},
    {"min_age": 40, "max_age": 49, "str": 20, "agi": 10, "int": 50, "chr": 40, "sta": 20},
    {"min_age": 50, "max_age": 59, "str": 10, "agi": 0, "int": 30, "chr": 20, "sta": 0},
    {"min_age": 60, "max_age": 69, "str": -10, "agi": -10, "int": 10, "chr": 0, "sta": -10},
    {"min_age": 70, "max_age": 999, "str": -20, "agi": -20, "int": 0, "chr": -10, "sta": -20},
]

XP_TABLE = [
    {"min_age": 0, "max_age": 9, "daily_xp": 1},
    {"min_age": 10, "max_age": 19, "daily_xp": 2},
    {"min_age": 20, "max_age": 29, "daily_xp": 3},
    {"min_age": 30, "max_age": 39, "daily_xp": 2},
    {"min_age": 40, "max_age": 49, "daily_xp": 1},
    {"min_age": 50, "max_age": 59, "daily_xp": 0},
    {"min_age": 60, "max_age": 69, "daily_xp": -1},
    {"min_age": 70, "max_age": 79, "daily_xp": -2},
    {"min_age": 80, "max_age": 89, "daily_xp": -3},
    {"min_age": 90, "max_age": 99, "daily_xp": -4},
    {"min_age": 100, "max_age": 999, "daily_xp": -5},
]

ACTIVITY_RULES = {
    # Projects
    "project_frontend": {"int": 100, "agi": 150, "label": "Frontend Project", "type": "coding"},
    "project_backend": {"int": 150, "str": 50, "label": "Backend API", "type": "coding"},
    "project_fullstack": {"int": 200, "agi": 100, "sta": 100, "label": "Full Stack App", "type": "coding"},
    "project_ai": {"int": 250, "agi": 50, "label": "AI Model", "type": "coding"},
    
    # Certificates
    "cert_cloud": {"int": 300, "sta": 100, "label": "Cloud Certification", "type": "learning"},
    "cert_security": {"int": 200, "sta": 200, "label": "Security Audit", "type": "learning"},
    "cert_frontend": {"agi": 250, "int": 100, "label": "Advanced Frontend", "type": "learning"},
    
    # Events / Other
    "event_hackathon": {"chr": 200, "int": 100, "agi": 100, "label": "Hackathon Win", "type": "event"},
    "event_talk": {"chr": 300, "label": "Tech Talk Speaker", "type": "event"},
    "gym_workout": {"str": 50, "vit": 50, "label": "Gym Session", "type": "physical"}
}

def calculate_age(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = datetime.now()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

def calculate_xp_and_level(age):
    total_xp = 0
    for current_year in range(age):
        daily_xp = 0
        for bracket in XP_TABLE:
            if bracket["min_age"] <= current_year <= bracket["max_age"]:
                daily_xp = bracket["daily_xp"]
                break
        total_xp += daily_xp * 365
    
    total_xp = max(0, total_xp)
    level = math.floor(total_xp / 365)
    current_xp_in_level = total_xp % 365
    
    return {
        "level": level,
        "total_xp": total_xp,
        "current_xp": current_xp_in_level,
        "next_level_xp": 365
    }

def calculate_natural_growth(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = datetime.now()
    
    # Calculate total months lived
    total_months = (today.year - birth_date.year) * 12 + (today.month - birth_date.month)
    
    natural_stats = {"str": 0, "agi": 0, "int": 0, "chr": 0, "sta": 0}
    
    # Iterate through each month of life
    for m in range(total_months):
        current_age_in_months = m
        current_age_years = math.floor(current_age_in_months / 12)
        
        # Find growth rates for this age
        growth = {"str": 0, "agi": 0, "int": 0, "chr": 0, "sta": 0}
        for bracket in GROWTH_TABLE:
            if bracket["min_age"] <= current_age_years <= bracket["max_age"]:
                growth = bracket
                break
        
        # Add monthly growth
        for stat in natural_stats:
            if stat in growth:
                natural_stats[stat] += growth[stat]
                
    return natural_stats

def calculate_rank(total_stats):
    # Updated Rank Thresholds for High Scale
    if total_stats < 1000: return {"title": "INTERN", "tier": "F", "color": "text-gray-500"}
    if total_stats < 4000: return {"title": "FRESHER", "tier": "E", "color": "text-gray-400"}
    if total_stats < 8000: return {"title": "JUNIOR", "tier": "D", "color": "text-green-500"}
    if total_stats < 15000: return {"title": "MID-LEVEL", "tier": "C", "color": "text-blue-500"}
    if total_stats < 30000: return {"title": "SENIOR", "tier": "B", "color": "text-purple-500"}
    if total_stats < 50000: return {"title": "LEAD", "tier": "A", "color": "text-orange-500"}
    if total_stats < 75000: return {"title": "PRINCIPAL", "tier": "S", "color": "text-red-500"}
    if total_stats < 100000: return {"title": "ARCHITECT", "tier": "SS", "color": "text-red-600"}
    return {"title": "LEGEND", "tier": "SSS", "color": "text-red-700"}

def calculate_stats(birth_date, history, achievements):
    age = calculate_age(birth_date)
    
    # 1. Level & XP
    xp_data = calculate_xp_and_level(age)
    
    # 2. Natural Growth (Base Stats)
    natural_stats = calculate_natural_growth(birth_date)
    
    stats = {
        "str": {"value": 0, "base": natural_stats["str"], "bonus": 0, "breakdown": [{"label": "Natural Growth", "value": natural_stats["str"]}]},
        "vit": {"value": 0, "base": 0, "bonus": 0, "breakdown": []},
        "agi": {"value": 0, "base": natural_stats["agi"], "bonus": 0, "breakdown": [{"label": "Natural Growth", "value": natural_stats["agi"]}]},
        "int": {"value": 0, "base": natural_stats["int"], "bonus": 0, "breakdown": [{"label": "Natural Growth", "value": natural_stats["int"]}]},
        "chr": {"value": 0, "base": natural_stats["chr"], "bonus": 0, "breakdown": [{"label": "Natural Growth", "value": natural_stats["chr"]}]},
        "sta": {"value": 0, "base": natural_stats["sta"], "bonus": 0, "breakdown": [{"label": "Natural Growth", "value": natural_stats["sta"]}]},
    }

    def add_breakdown(stat_key, label, value):
        if value != 0:
            stats[stat_key]["breakdown"].append({"label": label, "value": value})

    # 3. Organic Bonuses (History & Achievements)
    processed_history = []
    processed_achievements = []
    total_bonus_points = 0 

    # --- History Processing ---
    for item in history:
        item_copy = item.copy()
        item_bonuses = []
        item_type = item.get("type")
        
        # Experience (Job)
        if item_type == 'experience':
            try:
                start = datetime.strptime(item.get("startDate", ""), "%Y-%m-%d")
                end_str = item.get("endDate")
                end = datetime.strptime(end_str, "%Y-%m-%d") if end_str else datetime.now()
                months = (end.year - start.year) * 12 + (end.month - start.month)
                months = max(1, months)
            except:
                months = 1
            
            # STA: Tenure (High Scale)
            tenure_bonus = math.floor(months * 5) # x10 scale roughly
            stats["sta"]["bonus"] += tenure_bonus
            add_breakdown("sta", f"Exp: {item.get('company', 'Unknown')}", tenure_bonus)
            item_bonuses.append(f"+{tenure_bonus} STA")
            
            # Keyword Analysis (High Scale Bonuses: 200-400 range)
            desc = (item.get("description", "") + " " + item.get("skills", "")).lower()
            if "lead" in desc or "manager" in desc:
                val = 200 + math.floor(months * 2)
                stats["chr"]["bonus"] += val 
                add_breakdown("chr", "Leadership Exp", val)
                item_bonuses.append(f"+{val} CHR")
            if "develop" in desc or "code" in desc or "engineer" in desc:
                val = 200 + math.floor(months * 3)
                stats["int"]["bonus"] += val
                add_breakdown("int", "Engineering Exp", val)
                item_bonuses.append(f"+{val} INT")
            if "design" in desc or "frontend" in desc:
                val = 200 + math.floor(months * 2)
                stats["agi"]["bonus"] += val
                add_breakdown("agi", "Design/Frontend Exp", val)
                item_bonuses.append(f"+{val} AGI")

        # Projects
        elif item_type == 'project':
            role = item.get("role", "member").lower()
            if "leader" in role or "manager" in role:
                stats["chr"]["bonus"] += 200
                add_breakdown("chr", f"Project Lead: {item.get('name')}", 200)
                item_bonuses.append("+200 CHR")
                stats["int"]["bonus"] += 100
                add_breakdown("int", f"Project Mgmt: {item.get('name')}", 100)
                item_bonuses.append("+100 INT")
            elif "developer" in role or "coder" in role:
                stats["int"]["bonus"] += 150
                add_breakdown("int", f"Dev Role: {item.get('name')}", 150)
                item_bonuses.append("+150 INT")
                stats["agi"]["bonus"] += 100
                add_breakdown("agi", f"Dev Speed: {item.get('name')}", 100)
                item_bonuses.append("+100 AGI")
            elif "designer" in role:
                stats["agi"]["bonus"] += 200
                add_breakdown("agi", f"Design Role: {item.get('name')}", 200)
                item_bonuses.append("+200 AGI")
            else:
                stats["sta"]["bonus"] += 100
                add_breakdown("sta", f"Project Participation: {item.get('name')}", 100)
                item_bonuses.append("+100 STA")

        # Legacy / Other
        else:
            rule = ACTIVITY_RULES.get(item.get("id")) or ACTIVITY_RULES.get(item.get("type"))
            if rule:
                for stat in ["str", "vit", "agi", "int", "chr", "sta"]:
                    if stat in rule:
                        bonus = rule[stat]
                        if "duration" in item and "coef" in item:
                            bonus = math.floor(bonus * item["duration"] * item["coef"])
                        
                        if stat != "vit": 
                            stats[stat]["bonus"] += bonus
                            add_breakdown(stat, item.get("name", rule["label"]), bonus)
                            item_bonuses.append(f"+{bonus} {stat.upper()}")

        item_copy["bonuses"] = item_bonuses
        processed_history.append(item_copy)

    # --- Achievements Processing ---
    for cert in achievements:
        cert_copy = cert.copy()
        cert_bonuses = []
        
        # Base Bonus (High Scale)
        base_bonus = 300
        stats["int"]["bonus"] += base_bonus
        add_breakdown("int", cert.get("title", "Achievement"), base_bonus)
        cert_bonuses.append(f"+{base_bonus} INT")
        
        if cert.get("image"):
            proof_bonus = 100
            stats["chr"]["bonus"] += proof_bonus
            add_breakdown("chr", "Verified Proof", proof_bonus)
            cert_bonuses.append(f"+{proof_bonus} CHR")
            
        cert_copy["bonuses"] = cert_bonuses
        processed_achievements.append(cert_copy)

    # Sum up direct bonuses for VIT calculation
    for key in ["str", "agi", "int", "sta", "chr"]:
        total_bonus_points += stats[key]["bonus"]
        stats[key]["value"] = stats[key]["base"] + stats[key]["bonus"]

    # 4. Passive Stats (VIT & CHR)
    
    # VIT: Base Decay + Improvement
    base_vit = 100
    if age > 30:
        decay_years = age - 30
        decay_amount = math.floor(decay_years * 1) # 1% per year
        base_vit = max(0, 100 - decay_amount)
    
    add_breakdown("vit", "Base (Age Decay)", base_vit)
    
    # Improvement: 1% per 5 Bonus Points
    vit_improvement = math.floor(total_bonus_points / 5)
    add_breakdown("vit", "Improvement (from Bonus Stats)", vit_improvement)
    
    stats["vit"]["value"] = min(100, base_vit + vit_improvement)

    # CHR: Management + Social (Social is already in stats["chr"]["value"] from bonuses)
    # Management Bonus based on Level (Placeholder for Role/Team size)
    chr_management = math.floor(xp_data["level"] * 10) # x10 scale
    stats["chr"]["value"] += chr_management
    add_breakdown("chr", "Management Authority (Level)", chr_management)

    # 5. Agent Point (AP) Calculation
    # AP = (Level * 100) + (Sum(Core Stats) * (VIT / 100))
    sum_core_stats = stats["str"]["value"] + stats["agi"]["value"] + stats["int"]["value"] + stats["sta"]["value"] + stats["chr"]["value"]
    vit_multiplier = stats["vit"]["value"] / 100.0
    
    agent_point = (xp_data["level"] * 100) + math.floor(sum_core_stats * vit_multiplier)

    # 6. Rank & Skills
    rank = calculate_rank(sum_core_stats) # Rank based on raw stats, AP is separate power metric

    # Skills (Visual only)
    skills = []
    raw_skills = [
        {"label": "REACT.JS / FRONTEND OPS", "color": "neon-green"},
        {"label": "PYTHON / BACKEND SYSTEMS", "color": "neon-blue"},
        {"label": "AI / MACHINE LEARNING", "color": "neon-red"},
        {"label": "CYBERSECURITY PROTOCOLS", "color": "neon-green"},
    ]
    for skill in raw_skills:
        # Scale skill percentage relative to high stats (e.g., 2000 points = 100%)
        level_val = (stats["int"]["value"] + stats["agi"]["value"]) / 40 
        skills.append({**skill, "percentage": min(100, float(f"{level_val:.1f}"))})

    return {
        "age": age,
        "stats": stats,
        "agent_point": agent_point,
        "history": processed_history,
        "achievements": processed_achievements,
        "skills": skills,
        "rank": rank,
        "level": xp_data["level"],
        "current_xp": xp_data["current_xp"],
        "next_level_xp": xp_data["next_level_xp"],
        "jobStatus": "open"
    }
