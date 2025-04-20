// BMR Calculator based on the Harris-Benedict equation
export const calculateBMR = (
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// Calculate daily calorie needs based on activity level
export const calculateDailyCalories = (
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
): number => {
  const multipliers = {
    'sedentary': 1.2, // Little or no exercise
    'light': 1.375, // Light exercise 1-3 times/week
    'moderate': 1.55, // Moderate exercise 3-5 times/week
    'active': 1.725, // Active exercise 6-7 times/week
    'very-active': 1.9 // Very intense exercise daily, or physical job
  };
  
  return Math.round(bmr * multipliers[activityLevel]);
};

// Generate diet recommendations based on goals
export const generateDietPlan = (
  calories: number,
  goal: 'lose' | 'maintain' | 'gain'
): {
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  meals: number
} => {
  // Adjust calories based on goal
  let adjustedCalories = calories;
  if (goal === 'lose') {
    adjustedCalories = Math.round(calories * 0.8); // 20% deficit
  } else if (goal === 'gain') {
    adjustedCalories = Math.round(calories * 1.15); // 15% surplus
  }
  
  let protein = 0;
  let carbs = 0;
  let fats = 0;
  
  // Macronutrient distribution based on goal
  if (goal === 'lose') {
    // Higher protein, lower carb for fat loss
    protein = Math.round((adjustedCalories * 0.40) / 4); // 40% of calories from protein (4 calories per gram)
    fats = Math.round((adjustedCalories * 0.35) / 9);    // 35% of calories from fat (9 calories per gram) 
    carbs = Math.round((adjustedCalories * 0.25) / 4);   // 25% of calories from carbs (4 calories per gram)
  } else if (goal === 'maintain') {
    // Balanced macros for maintenance
    protein = Math.round((adjustedCalories * 0.30) / 4); // 30% protein
    fats = Math.round((adjustedCalories * 0.30) / 9);    // 30% fat
    carbs = Math.round((adjustedCalories * 0.40) / 4);   // 40% carbs
  } else if (goal === 'gain') {
    // Higher carb, adequate protein for muscle gain
    protein = Math.round((adjustedCalories * 0.25) / 4); // 25% protein
    fats = Math.round((adjustedCalories * 0.25) / 9);    // 25% fat
    carbs = Math.round((adjustedCalories * 0.50) / 4);   // 50% carbs
  }
  
  // Recommend number of meals
  const meals = adjustedCalories > 2000 ? 5 : 4;
  
  return {
    calories: adjustedCalories,
    protein,
    carbs,
    fats,
    meals
  };
};