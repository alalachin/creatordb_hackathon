"use client";

import { useState } from "react";
import FindCreatorsClient from "./FindCreatorsClient";

export default function FindCreatorsPage() {
  const [teaMode, setTeaMode] = useState(false);

  return (
    <div
      className={`min-h-screen px-4 py-12 max-w-5xl mx-auto transition-colors duration-300 ${
        teaMode ? "bg-slate-950 text-slate-100" : ""
      }`}
    >
      {/* Header */}
      <div className="mb-10 text-center">
        <div
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${
            teaMode
              ? "bg-violet-950 border border-violet-800 text-violet-200"
              : "bg-violet-50 border border-violet-100 text-violet-700"
          }`}
        >
          🎬 clearCreators
        </div>
        <h1 className={`text-4xl font-extrabold mb-2 ${teaMode ? "text-slate-100" : "text-slate-900"}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
            clearCreators
          </span>
        </h1>
        <p className={`max-w-md mx-auto ${teaMode ? "text-slate-300" : "text-slate-500"}`}>
          For small brands — find suitable creators with ease of mind based on your budget and audience.
        </p>
      </div>

      <FindCreatorsClient teaMode={teaMode} setTeaMode={setTeaMode} />
    </div>
  );
}
