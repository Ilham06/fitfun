const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

const PROGRAM_MODIFIERS = {
  BULKING: 1.15,
  CUTTING: 0.8,
  MAINTENANCE: 1.0,
};

export function calculateTDEE({ age, gender, weightKg, heightCm, activityLevel }) {
  let bmr;
  if (gender === "female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

export function calculateTargets({ tdee, program, weightKg }) {
  const modifier = PROGRAM_MODIFIERS[program] || 1.0;
  const dailyCalTarget = Math.round(tdee * modifier);

  const proteinTargetG = Math.round(weightKg * 2);
  const fatTargetG = Math.round(weightKg * 1);
  const remaining = dailyCalTarget - proteinTargetG * 4 - fatTargetG * 9;
  const carbTargetG = Math.round(Math.max(remaining, 0) / 4);

  return { dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG };
}
