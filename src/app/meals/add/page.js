"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Check, Search, X } from "lucide-react";
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
      <label className="text-[10px] font-semibold text-muted mb-1 block">Food Name</label>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
        <input
          type="text"
          placeholder="Search food (e.g. chicken, rice...)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg pl-9 pr-8 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={14} className="text-muted2" />
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
                <div className="text-sm font-medium text-text truncate">{food.name}</div>
                <div className="text-[10px] text-muted">
                  {food.kcal} kcal · {food.protein}g P · {food.carbs}g C · {food.fat}g F
                  <span className="ml-1 text-muted2">per 100g</span>
                </div>
              </div>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#F0F0F0] text-muted2 flex-shrink-0">
                {categoryLabels[food.category] || food.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-[#E8E8E8] shadow-lg p-4 text-center">
          <p className="text-xs text-muted">No results found</p>
          <p className="text-[10px] text-muted2 mt-1">You can enter values manually below</p>
        </div>
      )}
    </div>
  );
}

export default function AddMealPage() {
  const [mealType, setMealType] = useState("LUNCH");
  const [items, setItems] = useState([{ id: 1, foodId: null, name: "", portionG: 100, kcal: 0, protein: 0, carbs: 0, fat: 0 }]);

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link
          href="/meals"
          className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-text" />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-text">Log Meal</h1>
          <p className="text-[11px] text-muted">Search food or enter manually</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {/* Meal Type Picker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-text2 mb-3 block">Meal Type</span>
          <div className="flex gap-2">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all ${
                  mealType === type
                    ? "bg-[#2D9C7E] text-white shadow-sm"
                    : "bg-[#F5F5F5] text-muted hover:text-text"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text2">Item {index + 1}</span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-[11px] text-[#C0392B] font-semibold hover:bg-[#FFF5F5] px-2 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {/* Food Search Dropdown */}
                <FoodSearchInput
                  selectedFood={item.foodId ? foodDatabase.find((f) => f.id === item.foodId) : null}
                  onSelect={(food) => handleFoodSelect(item.id, food)}
                />

                {/* Portion */}
                <div>
                  <label className="text-[10px] font-semibold text-muted mb-1 block">Portion (grams)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={item.portionG || ""}
                    onChange={(e) => handlePortionChange(item.id, e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                  />
                </div>

                {/* Auto-calculated Macros (read-only when food is selected) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">
                      Calories (kcal) {item.foodId && <span className="text-[#2D9C7E]">· auto</span>}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.kcal || ""}
                      onChange={(e) => updateItem(item.id, "kcal", e.target.value)}
                      readOnly={!!item.foodId}
                      className={`w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                        item.foodId
                          ? "bg-[#E8F5F0] font-semibold"
                          : "bg-[#F8F8F8] focus:border-[#2D9C7E] placeholder:text-muted2"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">
                      Protein (g) {item.foodId && <span className="text-[#2D9C7E]">· auto</span>}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.protein || ""}
                      onChange={(e) => updateItem(item.id, "protein", e.target.value)}
                      readOnly={!!item.foodId}
                      className={`w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                        item.foodId
                          ? "bg-[#E8F5F0] font-semibold"
                          : "bg-[#F8F8F8] focus:border-[#2D9C7E] placeholder:text-muted2"
                      }`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">
                      Carbs (g) {item.foodId && <span className="text-[#2D9C7E]">· auto</span>}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.carbs || ""}
                      onChange={(e) => updateItem(item.id, "carbs", e.target.value)}
                      readOnly={!!item.foodId}
                      className={`w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                        item.foodId
                          ? "bg-[#E8F5F0] font-semibold"
                          : "bg-[#F8F8F8] focus:border-[#2D9C7E] placeholder:text-muted2"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">
                      Fat (g) {item.foodId && <span className="text-[#2D9C7E]">· auto</span>}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.fat || ""}
                      onChange={(e) => updateItem(item.id, "fat", e.target.value)}
                      readOnly={!!item.foodId}
                      className={`w-full border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                        item.foodId
                          ? "bg-[#E8F5F0] font-semibold"
                          : "bg-[#F8F8F8] focus:border-[#2D9C7E] placeholder:text-muted2"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Item */}
          <button
            onClick={addItem}
            className="flex items-center justify-center gap-2 py-3.5 bg-white rounded-2xl border-2 border-dashed border-[#E0E0E0] text-sm font-semibold text-muted hover:border-[#2D9C7E] hover:text-[#2D9C7E] transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Another Item
          </button>
        </div>

        {/* Total Summary */}
        {totals.kcal > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-text mb-3">Total</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">Total Calories</span>
              <span className="font-bold text-xl text-[#2D9C7E]">{totals.kcal} kcal</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2.5 bg-[#F8F8F8] rounded-xl">
                <div className="text-[10px] text-muted mb-0.5">Protein</div>
                <div className="font-bold text-protein">{totals.protein}g</div>
              </div>
              <div className="text-center p-2.5 bg-[#F8F8F8] rounded-xl">
                <div className="text-[10px] text-muted mb-0.5">Carbs</div>
                <div className="font-bold text-carb">{totals.carbs}g</div>
              </div>
              <div className="text-center p-2.5 bg-[#F8F8F8] rounded-xl">
                <div className="text-[10px] text-muted mb-0.5">Fat</div>
                <div className="font-bold text-fat">{totals.fat}g</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Link
          href="/meals"
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-[#2D9C7E] text-white font-semibold text-sm shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors"
        >
          <Check size={18} /> Log Meal ({items.length} {items.length === 1 ? "item" : "items"})
        </Link>
      </div>
    </div>
  );
}
