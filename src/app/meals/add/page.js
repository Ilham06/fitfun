"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Check, Search, X, ScanBarcode, Flame, Dumbbell, Wheat, Droplet, Minus } from "lucide-react";
import { foodDatabase, calculateNutrition, searchFood } from "@/lib/food-database";

function FoodSearchInput({ onSelect, selectedFood }) {
  const [query, setQuery] = useState(selectedFood?.name || "");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (selectedFood) setQuery(selectedFood.name);
  }, [selectedFood]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length >= 2) {
      setResults(searchFood(value));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (food) => {
    setQuery(food.name);
    setIsOpen(false);
    onSelect(food);
  };

  const categoryLabels = {
    protein: "Protein",
    carbs: "Carbs",
    fats: "Fats",
    vegetables: "Vegetables",
    dairy: "Dairy",
    meals: "Meals",
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-xs font-bold text-gray-500 mb-2 block">Food Name</label>
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search food (e.g. chicken, rice...)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          className="w-full bg-white border border-[#E8E8E8] rounded-xl pl-11 pr-11 py-3 text-sm text-gray-800 outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-gray-400 font-medium"
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full text-gray-500 hover:text-gray-700"
          >
            <X size={12} />
          </button>
        ) : (
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D9C7E]">
            <ScanBarcode size={20} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-[#E8E8E8] shadow-lg max-h-52 overflow-y-auto">
          {results.map((food) => (
            <button
              key={food.id}
              onClick={() => handleSelect(food)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#F8F8F8] transition-colors border-b border-[#F5F5F5] last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-800 truncate">{food.name}</div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {food.kcal} kcal · {food.protein}g P · {food.carbs}g C · {food.fat}g F
                  <span className="ml-1 text-gray-400">per 100g</span>
                </div>
              </div>
              <span className="text-[9px] font-black px-2 py-1 rounded bg-[#F0FDF4] text-[#2D9C7E] flex-shrink-0 uppercase tracking-wider">
                {categoryLabels[food.category] || food.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-[#E8E8E8] shadow-lg p-4 text-center">
          <p className="text-xs text-gray-500 font-bold">No results found</p>
          <p className="text-[10px] text-gray-400 mt-1">You can enter values manually below</p>
        </div>
      )}
    </div>
  );
}

export default function AddMealPage() {
  const router = useRouter();
  const [mealType, setMealType] = useState("LUNCH");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([{ id: 1, foodId: null, name: "", portionG: 100, kcal: 0, protein: 0, carbs: 0, fat: 0 }]);

  const mealTypes = [
    { id: "BREAKFAST", label: "Breakfast", icon: "☀️" },
    { id: "LUNCH", label: "Lunch", icon: "🥗" },
    { id: "DINNER", label: "Dinner", icon: "🌙" },
    { id: "SNACK", label: "Snack", icon: "🍎" },
  ];

  const handleFoodSelect = (itemId, food) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const nutrition = calculateNutrition(food.id, item.portionG || 100);
        return {
          ...item,
          foodId: food.id,
          name: food.name,
          kcal: nutrition.kcal,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        };
      })
    );
  };

  const handlePortionChange = (itemId, grams) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newItem = { ...item, portionG: Number(grams) || 0 };
        if (item.foodId) {
          const nutrition = calculateNutrition(item.foodId, newItem.portionG);
          if (nutrition) {
            newItem.kcal = nutrition.kcal;
            newItem.protein = nutrition.protein;
            newItem.carbs = nutrition.carbs;
            newItem.fat = nutrition.fat;
          }
        }
        return newItem;
      })
    );
  };

  const incrementPortion = (itemId, amount) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newPortion = Math.max(0, (item.portionG || 0) + amount);
    handlePortionChange(itemId, newPortion);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: Number(value) || 0 } : item))
    );
  };

  const addItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    setItems((prev) => [...prev, { id: newId, foodId: null, name: "", portionG: 100, kcal: 0, protein: 0, carbs: 0, fat: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + (Number(item.kcal) || 0),
      protein: acc.protein + (Number(item.protein) || 0),
      carbs: acc.carbs + (Number(item.carbs) || 0),
      fat: acc.fat + (Number(item.fat) || 0),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-6 overflow-hidden">
        <div className="relative z-10">
          <Link
            href="/meals"
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#F0F0F0] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-800" />
          </Link>
          <div className="mt-4">
            <h1 className="font-black text-2xl text-[#1E293B]">Log Meal</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">Search food or enter manually</p>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute right-0 top-4 w-44 h-auto opacity-90 pointer-events-none">
          <img src="/images/meals.png" alt="Decoration" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-8 relative z-10">
        {/* Meal Type Picker */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F1F5F9]">
          <span className="text-sm font-bold text-gray-800 mb-4 block">Meal Type</span>
          <div className="grid grid-cols-4 gap-2.5">
            {mealTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setMealType(type.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border transition-all ${
                  mealType === type.id
                    ? "bg-[#F0FDF4] border-[#2D9C7E] text-[#2D9C7E] shadow-sm"
                    : "bg-white border-[#F1F5F9] text-gray-600 hover:border-[#2D9C7E]/50 hover:bg-[#F0FDF4]/50"
                }`}
              >
                <span className="text-2xl drop-shadow-sm">{type.icon}</span>
                <span className="text-[10px] font-bold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#F1F5F9]">
              <div className="bg-[#F8FAFC] px-5 py-3.5 flex items-center justify-between border-b border-[#F1F5F9]">
                <span className="text-sm font-bold text-gray-800">Item {index + 1}</span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* Food Search Dropdown */}
                <FoodSearchInput
                  selectedFood={item.foodId ? foodDatabase.find((f) => f.id === item.foodId) : null}
                  onSelect={(food) => handleFoodSelect(item.id, food)}
                />

                {/* Portion */}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Portion (grams)</label>
                  <div className="flex items-center justify-between border border-[#E8E8E8] rounded-2xl p-1.5 bg-[#F8FAFC]">
                    <button 
                      onClick={() => incrementPortion(item.id, -10)}
                      className="w-12 h-10 rounded-xl bg-[#F0FDF4] text-[#2D9C7E] flex items-center justify-center hover:bg-[#E0F8E8] transition-colors shadow-sm"
                    >
                      <Minus size={18} strokeWidth={3} />
                    </button>
                    
                    <div className="flex items-baseline justify-center flex-1">
                      <input
                        type="number"
                        value={item.portionG || ""}
                        onChange={(e) => handlePortionChange(item.id, e.target.value)}
                        className="w-16 text-center text-xl font-black text-gray-800 bg-transparent outline-none p-0"
                      />
                      <span className="text-gray-400 font-bold text-sm ml-1">g</span>
                    </div>

                    <button 
                      onClick={() => incrementPortion(item.id, 10)}
                      className="w-12 h-10 rounded-xl bg-[#F0FDF4] text-[#2D9C7E] flex items-center justify-center hover:bg-[#E0F8E8] transition-colors shadow-sm"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Calories */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500">Calories (kcal)</label>
                      <Flame size={14} className="text-orange-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.kcal || ""}
                        onChange={(e) => updateItem(item.id, "kcal", e.target.value)}
                        readOnly={!!item.foodId}
                        className={`w-full border border-[#E8E8E8] rounded-xl pl-3 pr-10 py-3 text-sm text-gray-800 outline-none transition-colors ${
                          item.foodId ? "bg-[#F8FAFC] font-bold" : "bg-white focus:border-[#2D9C7E]"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">kcal</span>
                    </div>
                  </div>

                  {/* Protein */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500">Protein (g)</label>
                      <Dumbbell size={14} className="text-green-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.protein || ""}
                        onChange={(e) => updateItem(item.id, "protein", e.target.value)}
                        readOnly={!!item.foodId}
                        className={`w-full border border-[#E8E8E8] rounded-xl pl-3 pr-8 py-3 text-sm text-gray-800 outline-none transition-colors ${
                          item.foodId ? "bg-[#F8FAFC] font-bold" : "bg-white focus:border-[#2D9C7E]"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">g</span>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500">Carbs (g)</label>
                      <Wheat size={14} className="text-blue-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.carbs || ""}
                        onChange={(e) => updateItem(item.id, "carbs", e.target.value)}
                        readOnly={!!item.foodId}
                        className={`w-full border border-[#E8E8E8] rounded-xl pl-3 pr-8 py-3 text-sm text-gray-800 outline-none transition-colors ${
                          item.foodId ? "bg-[#F8FAFC] font-bold" : "bg-white focus:border-[#2D9C7E]"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">g</span>
                    </div>
                  </div>

                  {/* Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500">Fat (g)</label>
                      <Droplet size={14} className="text-yellow-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.fat || ""}
                        onChange={(e) => updateItem(item.id, "fat", e.target.value)}
                        readOnly={!!item.foodId}
                        className={`w-full border border-[#E8E8E8] rounded-xl pl-3 pr-8 py-3 text-sm text-gray-800 outline-none transition-colors ${
                          item.foodId ? "bg-[#F8FAFC] font-bold" : "bg-white focus:border-[#2D9C7E]"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Item Button */}
          <button
            onClick={addItem}
            className="w-full py-4 rounded-3xl border-2 border-dashed border-[#E2E8F0] bg-transparent text-[#2D9C7E] font-bold text-sm flex items-center justify-center gap-2 hover:bg-white hover:border-[#2D9C7E]/30 transition-all mt-2"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#2D9C7E] flex items-center justify-center">
              <Plus size={12} strokeWidth={3} />
            </div>
            Add Another Item
          </button>
        </div>

        {/* Total Summary (Optional, but good to keep if valid) */}
        {totals.kcal > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm mt-2 border border-[#F1F5F9]">
            <h3 className="font-bold text-sm text-gray-800 mb-3">Total</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500">Total Calories</span>
              <span className="font-black text-2xl text-[#2D9C7E]">{totals.kcal} <span className="text-sm font-bold">kcal</span></span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#F8FAFC] rounded-2xl">
                <div className="text-[10px] font-bold text-gray-500 mb-1">Protein</div>
                <div className="font-black text-gray-800">{totals.protein}g</div>
              </div>
              <div className="text-center p-3 bg-[#F8FAFC] rounded-2xl">
                <div className="text-[10px] font-bold text-gray-500 mb-1">Carbs</div>
                <div className="font-black text-gray-800">{totals.carbs}g</div>
              </div>
              <div className="text-center p-3 bg-[#F8FAFC] rounded-2xl">
                <div className="text-[10px] font-bold text-gray-500 mb-1">Fat</div>
                <div className="font-black text-gray-800">{totals.fat}g</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={async () => {
            const validItems = items.filter((i) => i.name && i.kcal > 0);
            if (validItems.length === 0) return;
            setSaving(true);
            try {
              await fetch("/api/food/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mealType,
                  items: validItems.map((i) => ({
                    name: i.name,
                    calories: i.kcal,
                    proteinG: i.protein,
                    carbG: i.carbs,
                    fatG: i.fat,
                    portionG: i.portionG,
                    source: i.foodId ? "DATABASE" : "MANUAL",
                  })),
                }),
              });
              router.push("/meals");
            } catch {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="w-full py-4 mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#2D9C7E] text-white font-bold text-sm shadow-[0_8px_16px_rgba(45,156,126,0.25)] hover:bg-[#258C6E] transition-all cursor-pointer disabled:opacity-60"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#2D9C7E]">
            <Check size={12} strokeWidth={4} />
          </div>
          {saving ? "Saving..." : `Log Meal (${items.length} ${items.length === 1 ? "item" : "items"})`}
        </button>
      </div>
    </div>
  );
}
