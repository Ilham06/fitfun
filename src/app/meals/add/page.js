"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";

const emptyItem = { name: "", portionG: "", kcal: "", protein: "", carbs: "", fat: "" };

export default function AddMealPage() {
  const [mealType, setMealType] = useState("LUNCH");
  const [items, setItems] = useState([{ ...emptyItem, id: 1 }]);

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    setItems((prev) => [...prev, { ...emptyItem, id: newId }]);
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
          <p className="text-[11px] text-muted">Add food items manually</p>
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
                <span className="text-xs font-semibold text-text2">
                  Item {index + 1}
                </span>
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
                {/* Food Name */}
                <div>
                  <label className="text-[10px] font-semibold text-muted mb-1 block">Food Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chicken breast"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                  />
                </div>

                {/* Portion & Calories */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">Portion (g)</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={item.portionG}
                      onChange={(e) => updateItem(item.id, "portionG", e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">Calories (kcal)</label>
                    <input
                      type="number"
                      placeholder="165"
                      value={item.kcal}
                      onChange={(e) => updateItem(item.id, "kcal", e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                    />
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">Protein (g)</label>
                    <input
                      type="number"
                      placeholder="31"
                      value={item.protein}
                      onChange={(e) => updateItem(item.id, "protein", e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.carbs}
                      onChange={(e) => updateItem(item.id, "carbs", e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted mb-1 block">Fat (g)</label>
                    <input
                      type="number"
                      placeholder="3.6"
                      value={item.fat}
                      onChange={(e) => updateItem(item.id, "fat", e.target.value)}
                      className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors placeholder:text-muted2"
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
          <Check size={18} /> Log Meal
        </Link>
      </div>
    </div>
  );
}
