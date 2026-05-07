// Static food database — nutrition values per 100g
// Source: USDA / general nutrition references

export const foodDatabase = [
  // Proteins
  { id: "chicken-breast", name: "Chicken Breast (grilled)", kcal: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
  { id: "chicken-thigh", name: "Chicken Thigh", kcal: 209, protein: 26, carbs: 0, fat: 11, category: "protein" },
  { id: "beef-lean", name: "Beef (lean)", kcal: 250, protein: 26, carbs: 0, fat: 15, category: "protein" },
  { id: "beef-ground", name: "Ground Beef (80/20)", kcal: 254, protein: 17, carbs: 0, fat: 20, category: "protein" },
  { id: "salmon", name: "Salmon (baked)", kcal: 208, protein: 20, carbs: 0, fat: 13, category: "protein" },
  { id: "tuna", name: "Tuna (canned in water)", kcal: 116, protein: 26, carbs: 0, fat: 1, category: "protein" },
  { id: "shrimp", name: "Shrimp", kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, category: "protein" },
  { id: "egg-whole", name: "Egg (whole, boiled)", kcal: 155, protein: 13, carbs: 1.1, fat: 11, category: "protein" },
  { id: "egg-white", name: "Egg White", kcal: 52, protein: 11, carbs: 0.7, fat: 0.2, category: "protein" },
  { id: "tofu", name: "Tofu (firm)", kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, category: "protein" },
  { id: "tempeh", name: "Tempeh", kcal: 192, protein: 20, carbs: 7.6, fat: 11, category: "protein" },
  { id: "greek-yogurt", name: "Greek Yogurt (plain)", kcal: 59, protein: 10, carbs: 3.6, fat: 0.7, category: "protein" },
  { id: "cottage-cheese", name: "Cottage Cheese", kcal: 98, protein: 11, carbs: 3.4, fat: 4.3, category: "protein" },
  { id: "whey-protein", name: "Whey Protein Powder", kcal: 380, protein: 75, carbs: 8, fat: 5, category: "protein" },

  // Carbohydrates
  { id: "white-rice", name: "White Rice (cooked)", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "carbs" },
  { id: "brown-rice", name: "Brown Rice (cooked)", kcal: 112, protein: 2.6, carbs: 24, fat: 0.9, category: "carbs" },
  { id: "pasta", name: "Pasta (cooked)", kcal: 131, protein: 5, carbs: 25, fat: 1.1, category: "carbs" },
  { id: "bread-white", name: "White Bread", kcal: 265, protein: 9, carbs: 49, fat: 3.2, category: "carbs" },
  { id: "bread-whole", name: "Whole Wheat Bread", kcal: 247, protein: 13, carbs: 41, fat: 3.4, category: "carbs" },
  { id: "oatmeal", name: "Oatmeal (cooked)", kcal: 68, protein: 2.4, carbs: 12, fat: 1.4, category: "carbs" },
  { id: "potato", name: "Potato (boiled)", kcal: 87, protein: 1.9, carbs: 20, fat: 0.1, category: "carbs" },
  { id: "sweet-potato", name: "Sweet Potato (baked)", kcal: 90, protein: 2, carbs: 21, fat: 0.1, category: "carbs" },
  { id: "banana", name: "Banana", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, category: "carbs" },
  { id: "apple", name: "Apple", kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, category: "carbs" },
  { id: "mango", name: "Mango", kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, category: "carbs" },
  { id: "corn", name: "Corn (cooked)", kcal: 96, protein: 3.4, carbs: 21, fat: 1.5, category: "carbs" },
  { id: "quinoa", name: "Quinoa (cooked)", kcal: 120, protein: 4.4, carbs: 21, fat: 1.9, category: "carbs" },

  // Fats
  { id: "avocado", name: "Avocado", kcal: 160, protein: 2, carbs: 9, fat: 15, category: "fats" },
  { id: "almonds", name: "Almonds", kcal: 579, protein: 21, carbs: 22, fat: 50, category: "fats" },
  { id: "peanut-butter", name: "Peanut Butter", kcal: 588, protein: 25, carbs: 20, fat: 50, category: "fats" },
  { id: "olive-oil", name: "Olive Oil", kcal: 884, protein: 0, carbs: 0, fat: 100, category: "fats" },
  { id: "butter", name: "Butter", kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, category: "fats" },
  { id: "cheese-cheddar", name: "Cheddar Cheese", kcal: 403, protein: 25, carbs: 1.3, fat: 33, category: "fats" },
  { id: "coconut-oil", name: "Coconut Oil", kcal: 862, protein: 0, carbs: 0, fat: 100, category: "fats" },
  { id: "walnuts", name: "Walnuts", kcal: 654, protein: 15, carbs: 14, fat: 65, category: "fats" },

  // Vegetables
  { id: "broccoli", name: "Broccoli", kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, category: "vegetables" },
  { id: "spinach", name: "Spinach (raw)", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "vegetables" },
  { id: "carrot", name: "Carrot", kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, category: "vegetables" },
  { id: "tomato", name: "Tomato", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: "vegetables" },
  { id: "cucumber", name: "Cucumber", kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, category: "vegetables" },
  { id: "lettuce", name: "Lettuce", kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: "vegetables" },
  { id: "bell-pepper", name: "Bell Pepper", kcal: 31, protein: 1, carbs: 6, fat: 0.3, category: "vegetables" },
  { id: "onion", name: "Onion", kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, category: "vegetables" },
  { id: "mushroom", name: "Mushroom", kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, category: "vegetables" },
  { id: "cabbage", name: "Cabbage", kcal: 25, protein: 1.3, carbs: 6, fat: 0.1, category: "vegetables" },

  // Dairy & Drinks
  { id: "milk-whole", name: "Whole Milk", kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, category: "dairy" },
  { id: "milk-skim", name: "Skim Milk", kcal: 34, protein: 3.4, carbs: 5, fat: 0.1, category: "dairy" },
  { id: "yogurt-plain", name: "Yogurt (plain)", kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, category: "dairy" },

  // Common meals (per typical serving as 100g equivalent)
  { id: "nasi-goreng", name: "Nasi Goreng (fried rice)", kcal: 168, protein: 4.5, carbs: 24, fat: 6, category: "meals" },
  { id: "mie-goreng", name: "Mie Goreng (fried noodles)", kcal: 170, protein: 5, carbs: 22, fat: 7, category: "meals" },
  { id: "rendang", name: "Rendang", kcal: 193, protein: 23, carbs: 3, fat: 10, category: "meals" },
  { id: "sate-ayam", name: "Sate Ayam (chicken satay)", kcal: 226, protein: 21, carbs: 7, fat: 13, category: "meals" },
  { id: "gado-gado", name: "Gado-Gado", kcal: 140, protein: 7, carbs: 12, fat: 8, category: "meals" },
  { id: "soto-ayam", name: "Soto Ayam", kcal: 72, protein: 7, carbs: 4, fat: 3, category: "meals" },
  { id: "bakso", name: "Bakso (meatball soup)", kcal: 76, protein: 8, carbs: 5, fat: 3, category: "meals" },
  { id: "nasi-padang", name: "Nasi Padang (mixed)", kcal: 210, protein: 10, carbs: 26, fat: 8, category: "meals" },
  { id: "ayam-geprek", name: "Ayam Geprek", kcal: 240, protein: 18, carbs: 14, fat: 12, category: "meals" },
  { id: "indomie", name: "Indomie (instant noodle)", kcal: 190, protein: 4, carbs: 26, fat: 8, category: "meals" },
];

// Get nutrition for a food item at a given weight
export function calculateNutrition(foodId, grams) {
  const food = foodDatabase.find((f) => f.id === foodId);
  if (!food) return null;

  const multiplier = grams / 100;
  return {
    name: food.name,
    portionG: grams,
    kcal: Math.round(food.kcal * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
  };
}

// Search food by name
export function searchFood(query) {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return foodDatabase.filter((f) => f.name.toLowerCase().includes(lower));
}

// Get all categories
export function getCategories() {
  return [...new Set(foodDatabase.map((f) => f.category))];
}

// Get foods by category
export function getFoodsByCategory(category) {
  return foodDatabase.filter((f) => f.category === category);
}
