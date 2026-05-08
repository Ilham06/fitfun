"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Check, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";

const fallbackItems = [
  { id: 1, name: "White Rice", portionG: 200, kcal: 260, protein: 5, carbs: 57, fat: 0.6 },
  { id: 2, name: "Grilled Chicken Breast", portionG: 100, kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 3, name: "Stir-Fried Vegetables", portionG: 80, kcal: 45, protein: 2, carbs: 6, fat: 1.8 },
];

export default function FoodResultPage() {
  const router = useRouter();
  const [items, setItems] = useState(fallbackItems);
  const [mealType, setMealType] = useState("LUNCH");
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const mapped = parsed.map((item, i) => ({
          id: i + 1,
          name: item.name,
          portionG: item.portionG || 100,
          kcal: item.kcal || 0,
          protein: item.proteinG || 0,
          carbs: item.carbG || 0,
          fat: item.fatG || 0,
        }));
        if (mapped.length > 0) setItems(mapped);
        sessionStorage.removeItem("scanResult");
      } catch { /* use fallback */ }
    }
  }, []);

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

  const totals = items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: field === "name" ? value : Number(value) || 0 } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    setItems((prev) => [
      ...prev,
      { id: newId, name: "New Item", portionG: 100, kcal: 0, protein: 0, carbs: 0, fat: 0 },
    ]);
    setExpandedId(newId);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link
          href="/scan"
          className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-text" />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-text">Scan Result</h1>
          <p className="text-[11px] text-muted">{items.length} items detected</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-8">
        {/* Source badges */}
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(45,156,126,0.1)] text-[#2D9C7E]">
            <Camera size={12} /> GPT-4o Vision
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(45,156,126,0.06)] text-[#2D9C7E]">
            Tap item to edit
          </span>
        </div>

        {/* Detected Items */}
        <div className="flex flex-col gap-2.5">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Item Summary Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center flex-shrink-0">
                    <Pencil size={16} className="text-[#2D9C7E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-text truncate">{item.name}</div>
                    <div className="text-[11px] text-muted mt-0.5">
                      {item.portionG}g · {item.protein}g P · {item.carbs}g C · {item.fat}g F
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 mr-1">
                    <div className="font-bold text-sm text-[#2D9C7E]">{item.kcal}</div>
                    <div className="text-[9px] text-muted">kcal</div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-muted2 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted2 flex-shrink-0" />
                  )}
                </button>

                {/* Expanded Edit Form */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#F0F0F0]">
                    <div className="pt-4 flex flex-col gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-muted mb-1 block">Food Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-semibold text-muted mb-1 block">Portion (g)</label>
                          <input
                            type="number"
                            value={item.portionG}
                            onChange={(e) => updateItem(item.id, "portionG", e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted mb-1 block">Calories (kcal)</label>
                          <input
                            type="number"
                            value={item.kcal}
                            onChange={(e) => updateItem(item.id, "kcal", e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[10px] font-semibold text-muted mb-1 block">Protein (g)</label>
                          <input
                            type="number"
                            value={item.protein}
                            onChange={(e) => updateItem(item.id, "protein", e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted mb-1 block">Carbs (g)</label>
                          <input
                            type="number"
                            value={item.carbs}
                            onChange={(e) => updateItem(item.id, "carbs", e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted mb-1 block">Fat (g)</label>
                          <input
                            type="number"
                            value={item.fat}
                            onChange={(e) => updateItem(item.id, "fat", e.target.value)}
                            className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-[#2D9C7E] transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center gap-1.5 py-2 text-[#C0392B] text-xs font-semibold hover:bg-[#FFF5F5] rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Remove Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Item Button */}
          <button
            onClick={addItem}
            className="flex items-center justify-center gap-2 py-3.5 bg-white rounded-2xl border-2 border-dashed border-[#E0E0E0] text-sm font-semibold text-muted hover:border-[#2D9C7E] hover:text-[#2D9C7E] transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>

        {/* Total Summary */}
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

        {/* Save Button */}
        <button
          onClick={async () => {
            setSaving(true);
            try {
              await fetch("/api/food/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mealType,
                  items: items.map((i) => ({
                    name: i.name,
                    calories: i.kcal,
                    proteinG: i.protein,
                    carbG: i.carbs,
                    fatG: i.fat,
                    portionG: i.portionG,
                    source: "GPT_VISION",
                  })),
                }),
              });
              router.push("/dashboard");
            } catch {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-[#2D9C7E] text-white font-semibold text-sm shadow-[0_2px_8px_rgba(45,156,126,0.3)] hover:bg-[#258C6E] transition-colors cursor-pointer disabled:opacity-60"
        >
          <Check size={18} /> {saving ? "Saving..." : `Log Meal (${items.length} items)`}
        </button>
      </div>
    </div>
  );
}
