const PROFILE_DATA = require('../data/db');

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const calculateAgeBonus = (age) => {
  let bonus = 10; // Base value
  for (let i = 1; i <= age; i++) {
    if (i <= 10) bonus += 1;
    else if (i <= 20) bonus += 2;
    else if (i <= 30) bonus += 3;
    else if (i <= 40) bonus += 2;
    else if (i <= 50) bonus += 1;
    else if (i <= 60) bonus += 0;
    else if (i <= 70) bonus -= 1;
    else if (i <= 80) bonus -= 2;
    else if (i <= 90) bonus -= 3;
    else bonus -= 4; 
  }
  return bonus;
};

const calculateStats = () => {
  const { birthDate, history, achievements } = PROFILE_DATA;
  const age = calculateAge(birthDate);
  const ageBonus = calculateAgeBonus(age);

  const stats = {
    str: { value: 0, base: ageBonus, bonus: 0, breakdown: [] },
    vit: { value: 0, base: 100, bonus: 0, breakdown: [] }, // VIT starts at 100%
    agi: { value: 0, base: ageBonus, bonus: 0, breakdown: [] },
    int: { value: 0, base: ageBonus, bonus: 0, breakdown: [] },
    chr: { value: 0, base: ageBonus, bonus: 0, breakdown: [] },
    sta: { value: 0, base: ageBonus, bonus: 0, breakdown: [] },
  };

  // Helper to add breakdown
  const addBreakdown = (stat, label, value) => {
    if (value !== 0) {
      stats[stat].breakdown.push({ label, value });
    }
  };

  // Initial Base Breakdown
  ['str', 'agi', 'int', 'chr', 'sta'].forEach(key => {
    addBreakdown(key, `Base Stats (Age ${age})`, ageBonus);
  });
  addBreakdown('vit', 'Max Health Cap', 100);


  // 1. Process History & Activities
  history.forEach(item => {
    const value = Math.floor(item.duration * item.coef * 50);
    
    // STR: Muscle (Gym/Physical)
    if (item.type === 'physical') {
      stats.str.bonus += value;
      addBreakdown('str', item.name, value);
    }

    // VIT: Health (Lifestyle Penalties & Physical Buffs)
    if (item.type === 'physical') {
      // Physical activity adds "resilience" to offset penalties, but max is 100
      // For calculation simplicity, we treat VIT as 100 - Penalties + Buffs, capped at 100 later
      stats.vit.bonus += value; 
      addBreakdown('vit', item.name, value);
    }
    if (item.type === 'lifestyle') {
      const penalty = item.duration * item.coef; // e.g., 1.0 * -20 = -20
      stats.vit.bonus += penalty;
      addBreakdown('vit', item.name, penalty);
    }

    // AGI: Speed (Coding Projects)
    if (item.type === 'coding') {
      const speedBonus = Math.floor(value * 0.8);
      stats.agi.bonus += speedBonus;
      addBreakdown('agi', item.name, speedBonus);
    }

    // INT: Intelligence (Coding/Learning)
    if (item.type === 'coding') {
      stats.int.bonus += value;
      addBreakdown('int', item.name, value);
    }

    // CHR: Charisma (Leadership)
    if (item.type === 'leadership' || item.type === 'community') {
      stats.chr.bonus += value;
      addBreakdown('chr', item.name, value);
    }

    // STA: Stamina (Tenure)
    if (item.type === 'coding' || item.type === 'physical') {
      const tenureBonus = Math.floor(value * 0.5);
      stats.sta.bonus += tenureBonus;
      addBreakdown('sta', item.name, tenureBonus);
    }
  });

  // 2. Special Bonuses (Certificates, Projects, etc.)
  
  // INT: Certificates
  const certBonus = achievements.length * 30;
  stats.int.bonus += certBonus;
  addBreakdown('int', 'Certificates Bonus', certBonus);

  // AGI: Project Count
  const projectCount = history.filter(h => h.type === 'coding').length; // Simplified, ideally from 'projects' array
  const projectSpeedBonus = projectCount * 20;
  stats.agi.bonus += projectSpeedBonus;
  addBreakdown('agi', 'Completed Projects Bonus', projectSpeedBonus);

  // CHR: Management
  const managementCount = history.filter(h => h.type === 'leadership').length;
  const managementBonus = managementCount * 15;
  stats.chr.bonus += managementBonus;
  addBreakdown('chr', 'Management Bonus', managementBonus);

  // 3. Final Calculations & Cross-Stat Bonuses

  // STR Final
  stats.str.value = Math.floor(stats.str.base + stats.str.bonus);

  // VIT Final (Capped at 100%)
  // Logic: Base 100 + Bonus (which might be negative from lifestyle or positive from gym)
  // If Gym (+200) and Lifestyle (-20), Net is +180. 100 + 180 = 280. Cap at 100? 
  // User said "VIT % max is 100%". 
  // Let's interpret: 100 is perfect health. Penalties reduce it. Gym helps recover/maintain it.
  // So: Value = Math.min(100, Math.max(0, 100 + stats.vit.bonus));
  // But wait, if Gym gives +200, it effectively negates HUGE penalties. That makes sense.
  stats.vit.value = Math.min(100, Math.max(0, 100 + stats.vit.bonus));

  // AGI Final
  stats.agi.value = Math.floor(stats.agi.base + stats.agi.bonus);

  // INT Final
  stats.int.value = Math.floor(stats.int.base + stats.int.bonus);

  // CHR Final
  stats.chr.value = Math.floor(stats.chr.base + stats.chr.bonus);

  // STA Final (AQ) = Base + Activity + (STR + VIT) * 0.2
  // Note: We use the raw calculated STR/VIT (before cap? or after?). 
  // Let's use the effective physical capability (so maybe before cap for VIT to reflect "potential"? 
  // No, let's use the final values for consistency, or maybe raw STR + raw VIT bonus).
  // Let's use Final STR + Final VIT (which is % health). 
  // Actually, "Physical Foundation" usually implies raw power and health. 
  // Let's use stats.str.value + stats.vit.value.
  const physicalFoundation = Math.floor((stats.str.value + stats.vit.value) * 0.2);
  stats.sta.bonus += physicalFoundation;
  addBreakdown('sta', 'Physical Foundation (STR+VIT)', physicalFoundation);
  stats.sta.value = Math.floor(stats.sta.base + stats.sta.bonus);

  // 4. Calculate Skills
  const rawSkills = [
    { label: "REACT.JS / FRONTEND OPS", color: "neon-green" },
    { label: "PYTHON / BACKEND SYSTEMS", color: "neon-blue" },
    { label: "AI / MACHINE LEARNING", color: "neon-red" },
    { label: "CYBERSECURITY PROTOCOLS", color: "neon-green" },
  ];

  const skills = rawSkills.map(skill => {
    const level = history.reduce((total, item) => {
      if (item.skills.includes(skill.label)) {
        return total + (item.duration * item.coef);
      }
      return total;
    }, 0);
    return { ...skill, percentage: parseFloat(level.toFixed(1)) };
  });

  return {
    age,
    stats,
    history,
    achievements,
    skills,
    rank: calculateRank(stats.str.value + stats.vit.value + stats.agi.value + stats.int.value + stats.chr.value + stats.sta.value), // Total Stats determine Rank
    jobStatus: PROFILE_DATA.jobStatus
  };
};

const calculateRank = (totalStats) => {
  // Rank System: Intern (F) -> Architect (SSS)
  // Thresholds based on total stat points (approx 6 stats * 100 max = 600+ potential)
  
  if (totalStats < 1500) return { title: "INTERN", tier: "F", color: "text-gray-500" }; // Starting out
  if (totalStats < 2500) return { title: "FRESHER", tier: "E", color: "text-gray-400" };
  if (totalStats < 4000) return { title: "JUNIOR", tier: "D", color: "text-green-500" };
  if (totalStats < 6000) return { title: "MID-LEVEL", tier: "C", color: "text-blue-500" };
  if (totalStats < 8500) return { title: "SENIOR", tier: "B", color: "text-purple-500" };
  if (totalStats < 12000) return { title: "LEAD", tier: "A", color: "text-orange-500" };
  if (totalStats < 16000) return { title: "PRINCIPAL", tier: "S", color: "text-red-500" };
  if (totalStats < 22000) return { title: "ARCHITECT", tier: "SS", color: "text-red-600" };
  return { title: "LEGEND", tier: "SSS", color: "text-red-700" };
};

module.exports = { calculateStats };
