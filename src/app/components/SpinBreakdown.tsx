'use client';

import { useState } from "react";

const POSITIONS = ["Camel", "Sit", "Upright"];
const FEATURES = ["Change of foot", "Difficult entry", "8+ revolutions"];

type SpinBreakdownProps = {
  onSubmit: (result: { shortForm: string; baseValue: number }) => void;
  onClose: () => void;
};

export default function SpinBreakdown({ onSubmit, onClose }: SpinBreakdownProps) {
  const [positions, setPositions] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const toggle = (arr: string[], setArr: (val: string[]) => void, value: string) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const calculateLevel = () => {
    const featureCount = features.length + positions.length;
    let level = 1;
    if (featureCount >= 4) level = 4;
    else if (featureCount === 3) level = 3;
    else if (featureCount === 2) level = 2;

    const shortForm = `CCoSp${level}`;
    const baseValues: Record<string, number> = {
      CCoSp1: 2.0,
      CCoSp2: 2.5,
      CCoSp3: 3.2,
      CCoSp4: 3.5,
    };

    onSubmit({ shortForm, baseValue: baseValues[shortForm] });
    onClose();
  };

  return (
    <div className="border p-4 bg-white rounded shadow space-y-4">
      <h2 className="font-bold text-lg">🌀 Spin Breakdown</h2>

      <div>
        <p className="font-medium">Positions</p>
        <div className="flex flex-wrap gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              className={`border px-3 py-1 rounded ${
                positions.includes(pos) ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => toggle(positions, setPositions, pos)}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium">Additional Features</p>
        <div className="flex flex-wrap gap-2">
          {FEATURES.map((feat) => (
            <button
              key={feat}
              className={`border px-3 py-1 rounded ${
                features.includes(feat) ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => toggle(features, setFeatures, feat)}
            >
              {feat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="text-sm text-red-600" onClick={onClose}>
          Cancel
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={calculateLevel}
        >
          ✅ Calculate
        </button>
      </div>
    </div>
  );
}
