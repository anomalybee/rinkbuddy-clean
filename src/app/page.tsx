"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { validateProgram } from "@/lib/validateProgram";
import { normalizeElement } from "@/lib/normalizeElement";
import Nav from "@/components/Nav";

export default function SkatingAdvisor() {
  const [elements, setElements] = useState([{ name: "", baseValue: "", type: "" }]);
  const [score, setScore] = useState<string | null>(null);
  const [percentile, setPercentile] = useState<string | null>(null);
  const [chatResponse, setChatResponse] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [gender, setGender] = useState("");
  const [season, setSeason] = useState("2025-26");
  const [level, setLevel] = useState("");
  const [segment, setSegment] = useState("");

  const addElement = () => {
    setElements([...elements, { name: "", baseValue: "", type: "" }]);
  };

  const handleElementChange = (index: number, field: string, value: string) => {
    const newElements = [...elements];
    newElements[index][field as keyof typeof newElements[number]] = value;
    setElements(newElements);
  };

  const handleComplete = (index: number) => {
    const el = elements[index];
    const updated = [...elements];
    const { shortForm, baseValue } = normalizeElement(el.name);

    updated[index] = {
      ...el,
      name: shortForm,
      baseValue: baseValue?.toString() || "",
    };

    setElements(updated);
  };

  const calculateScore = () => {
    const cleanedElements = elements.map((el) => ({
      ...el,
      name: el.name?.split(":")[0] || el.name,
    }));

    const total = cleanedElements.reduce((sum, el) => sum + parseFloat(el.baseValue || "0"), 0);
    const ruleFeedback = validateProgram({
      season,
      gender,
      level,
      segment,
      elements: cleanedElements,
    });

    setScore(total.toFixed(2));
    setPercentile(
      total >= 20
        ? "Top 10% (Likely to podium)"
        : total >= 15
        ? "Top 30% (Final group)"
        : "Lower 50% (Needs improvement)"
    );

    setChatResponse(
      ruleFeedback.includes("✅")
        ? "✅ All rules met! 🎉\n\nThis is a strong program! You may want to focus on GOE quality and PCS."
        : "⚠️ Rule Warnings:\n" + ruleFeedback + "\n\n👟 Tip: Focus on required elements and avoid illegal repeats or extra spins."
    );
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setUploadMessage("❌ Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;
      const { error } = await supabase.from("uploads").insert([
        {
          file_name: file.name,
          content: fileContent,
          season,
          gender,
          level,
          segment,
          uploaded_at: new Date().toISOString(),
        },
      ]);
      setUploadMessage(error ? `❌ Upload failed: ${error.message}` : `✅ Uploaded: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const ruleViolations = validateProgram({
    season,
    gender,
    level,
    segment,
    elements: elements.map((el) => ({
      ...el,
      name: el.name?.split(":")[0] || el.name,
    })),
  });

  return (
    <>
      <Nav />
      <div className="bg-gray-50 min-h-screen p-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">⛸️ Figure Skating Program Advisor</h1>

        {/* Select Fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Gender", value: gender, setter: setGender, options: ["women", "men"] },
            { label: "Season", value: season, setter: setSeason, options: ["2024-25", "2025-26"] },
            { label: "Level", value: level, setter: setLevel, options: ["juvenile", "intermediate", "junior", "senior"] },
            { label: "Program Type", value: segment, setter: setSegment, options: ["short_program", "free_skate"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <Label>{label}</Label>
              <select
                className="w-full border rounded p-2"
                value={value}
                onChange={(e) => setter(e.target.value)}
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Element Entry */}
        <Card>
          <CardContent className="space-y-4 py-6">
            {elements.map((el, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                <select
                  className="col-span-2 border rounded p-2"
                  value={el.type}
                  onChange={(e) => handleElementChange(idx, "type", e.target.value)}
                >
                  <option value="">Type</option>
                  <option value="jump">Jump</option>
                  <option value="spin">Spin</option>
                  <option value="step">Step</option>
                </select>

                <Input
                  className="col-span-5"
                  placeholder="Element (e.g., 3Lz+2T, StSq)"
                  value={el.name}
                  onChange={(e) => handleElementChange(idx, "name", e.target.value)}
                />

                <Input
                  className="col-span-3"
                  type="number"
                  placeholder="Base Value"
                  value={el.baseValue}
                  onChange={(e) => handleElementChange(idx, "baseValue", e.target.value)}
                />

                <Button
                  variant="outline"
                  className="col-span-2"
                  onClick={() => handleComplete(idx)}
                >
                  ✓ Confirm
                </Button>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button onClick={addElement}>+ Add Element</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={calculateScore}>
                Calculate Score
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rule Feedback */}
        {ruleViolations && !ruleViolations.includes("✅") && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded space-y-1">
            <p className="font-semibold">⚠️ Rule Violations:</p>
            <ul className="list-disc pl-5 whitespace-pre-line">
              {ruleViolations.split("\n").map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Score */}
        {score && (
          <div className="space-y-4">
            <Card>
              <CardContent className="py-4">
                <p className="text-xl font-semibold">
                  🧮 Estimated Base Value Score: <span className="text-blue-700">{score}</span>
                </p>
                <p className="text-lg">
                  📊 Estimated Percentile: <span className="text-green-700">{percentile}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <p className="text-lg font-medium">🤖 Chatbot Advice:</p>
                <p className="whitespace-pre-line italic text-gray-700">{chatResponse}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PDF Upload */}
        <Card>
          <CardContent className="space-y-4 py-6">
            <Label htmlFor="file">📤 Upload Competition Results (PDF)</Label>
            <Input id="file" type="file" accept="application/pdf" onChange={handleUpload} />
            {uploadMessage && (
              <p className="text-sm text-gray-700 italic">{uploadMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
