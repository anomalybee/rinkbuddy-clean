// src/lib/validateProgram.ts

type Element = {
    name: string;
    baseValue: string;
    type: string;
  };
  
  type ProgramInput = {
    season: string;
    gender: string;
    level: string;
    segment: string;
    elements: Element[];
  };
  
  export function validateProgram({
    season,
    gender,
    level,
    segment,
    elements,
  }: ProgramInput): string {
    let messages: string[] = [];
  
    const jumpCount = elements.filter((e) => e.type === "jump").length;
    const spinCount = elements.filter((e) => e.type === "spin").length;
    const stepCount = elements.filter((e) => e.type === "step").length;
  
    // Example rules (customize per USFSA spec later)
    if (segment === "short_program") {
      if (jumpCount < 2) messages.push("❌ Short Program is missing jump elements.");
      if (spinCount < 1) messages.push("❌ Short Program is missing a spin.");
      if (stepCount < 1) messages.push("❌ Short Program is missing a step sequence.");
      if (jumpCount > 3) messages.push("⚠️ Too many jumps — max is 3 for short program.");
    }
  
    if (segment === "free_skate") {
      if (jumpCount < 4) messages.push("❌ Free Skate should include at least 4 jump elements.");
      if (spinCount < 2) messages.push("❌ Free Skate should include at least 2 spins.");
      if (stepCount < 1) messages.push("❌ Free Skate is missing a step sequence.");
      if (jumpCount > 7) messages.push("⚠️ Too many jumps — max is 7 for free skate.");
    }
  
    return messages.length === 0
      ? "✅ All program rules satisfied!"
      : messages.join("\n");
  }
  