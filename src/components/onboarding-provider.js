"use client";

import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

const defaultData = {
  name: "",
  age: "",
  gender: "male",
  weight: "",
  height: "",
  program: "BULKING",
  activityLevel: "moderately_active",
  targetWeight: "",
};

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(defaultData);

  const update = (fields) => setData((prev) => ({ ...prev, ...fields }));

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
