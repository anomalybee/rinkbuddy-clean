// src/lib/normalizeElement.ts

export function normalizeElement(name: string): {
    shortForm: string;
    baseValue: number | null;
  } {
    const jumpBaseValues: Record<string, number> = {
      "1T": 0.4,
      "2T": 1.3,
      "3T": 4.2,
      "4T": 9.5,
      "1S": 0.4,
      "2S": 1.3,
      "3S": 4.3,
      "4S": 9.7,
      "1Lo": 0.5,
      "2Lo": 1.7,
      "3Lo": 4.9,
      "4Lo": 10.5,
      "1F": 0.5,
      "2F": 1.8,
      "3F": 5.3,
      "4F": 11.0,
      "1Lz": 0.6,
      "2Lz": 2.1,
      "3Lz": 5.9,
      "4Lz": 11.5,
      "1A": 1.1,
      "2A": 3.3,
      "3A": 8.0,
      "4A": 12.5,
    };
  
    const trimmed = name.trim().replace(/\s+/g, "");
  
    // Handle jump combos like "3Lz+2T"
    if (trimmed.includes("+")) {
      const parts = trimmed.split("+");
      let total = 0;
      for (let part of parts) {
        const base = jumpBaseValues[part];
        if (!base) return { shortForm: trimmed, baseValue: null };
        total += base;
      }
      return { shortForm: trimmed, baseValue: total };
    }
  
    // Handle single jump
    if (jumpBaseValues[trimmed]) {
      return { shortForm: trimmed, baseValue: jumpBaseValues[trimmed] };
    }
  
    // Step sequences (placeholder logic)
    if (trimmed.toLowerCase().includes("step")) {
      return { shortForm: "StSq", baseValue: 2.6 };
    }
  
    return { shortForm: trimmed, baseValue: null };
  }
  