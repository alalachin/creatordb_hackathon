"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Creator, CreatorSearchQuery } from "@/lib/types";
import { formatNumber } from "@/lib/client-utils";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Users,
  Globe,
  Languages,
  DollarSign,
  BarChart3,
  Hash,
  AlertCircle,
  Sparkles,
  Flame,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

type CreatorRisk = {
  channel_name: string;
  risk_level: string;
  risk_score: number;
  risk_keywords: string[];
  risk_finding: string;
  demographics?: {
    gender?: { male: number | null; female: number | null };
    top_countries?: string[] | null;
  };
};

function normalizeChannelName(name: string) {
  return name.trim().toLowerCase();
}

function formatGender(risk?: CreatorRisk) {
  const male = risk?.demographics?.gender?.male;
  const female = risk?.demographics?.gender?.female;
  if (typeof male !== "number" || typeof female !== "number") return "N/A";
  return `M ${male.toFixed(1)}% / F ${female.toFixed(1)}%`;
}

function extractHighestTopMarket(creator: Creator, risk?: CreatorRisk) {
  const topFromRisk = risk?.demographics?.top_countries?.[0];
  if (topFromRisk && topFromRisk.trim()) return topFromRisk.trim();

  if (!creator.topCountries || creator.topCountries === "N/A") return "N/A";
  const [first] = creator.topCountries.split(",");
  return first?.trim() || "N/A";
}

const PRODUCT_TYPES = [
  "Sportswear",
];

const BUDGET_OPTIONS: Record<string, [number, number]> = {
  "Micro ($1K–$5K)": [1_000, 5_000],
  "Small ($5K–$25K)": [5_000, 25_000],
  "Medium ($25K–$50K)": [25_000, 50_000],
  "Large ($50K–$100K)": [50_000, 100_000],
  "Enterprise ($100K+)": [100_000, 100_000],
};

const BUDGET_SUBLABELS: Record<string, string> = {
  "Micro ($1K–$5K)": "$1,000 – $5,000",
  "Small ($5K–$25K)": "$5,000 – $25,000",
  "Medium ($25K–$50K)": "$25,000 – $50,000",
  "Large ($50K–$100K)": "$50,000 – $100,000",
  "Enterprise ($100K+)": "$100,000+",
};

const LANGUAGES = [
  "Any", "English", "Spanish", "French", "German",
  "Mandarin", "Japanese", "Korean", "Thai", "Portuguese",
];
const LOCATIONS = [
  "Any", "USA", "Canada", "UK", "Europe", "Asia",
  "South Korea", "Thailand", "Japan", "India", "Brazil", "Mexico",
];
const GENDERS = ["Any", "Male", "Female", "Mixed"];
const AGE_GROUPS = ["Any", "<17", "18-24", "25-34", "35-44", "45+"];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepPill({
  number,
  label,
  active,
  teaMode,
}: {
  number: number;
  label: string;
  active: boolean;
  teaMode: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
          active
            ? teaMode
              ? "bg-teal-500 text-slate-950 shadow-sm shadow-teal-900"
              : "bg-teal-600 text-white shadow-sm shadow-teal-200"
            : teaMode
              ? "bg-slate-800 border-2 border-slate-700 text-slate-400"
              : "bg-white border-2 border-slate-200 text-slate-400"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-xs font-semibold hidden sm:inline transition-colors duration-200 ${
          active
            ? teaMode
              ? "text-teal-300"
              : "text-teal-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Creator avatar ───────────────────────────────────────────────────────────

function CreatorAvatar({ url, name }: { url: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!err && url && url.toLowerCase().startsWith("http")) {
    return (
      <Image
        src={url}
        alt={`${name} avatar`}
        width={72}
        height={72}
        className="w-[72px] h-[72px] rounded-2xl object-cover border-2 border-blue-100 shrink-0"
        onError={() => setErr(true)}
        unoptimized
      />
    );
  }
  return (
    <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-200 flex items-center justify-center shrink-0 text-2xl">
      👤
    </div>
  );
}

// ─── Creator card ─────────────────────────────────────────────────────────────

function CreatorCard({
  creator,
  index,
  delay,
  teaMode,
  risk,
}: {
  creator: Creator;
  index: number;
  delay: number;
  teaMode: boolean;
  risk?: CreatorRisk;
}) {
  const chips = [
    creator.country !== "N/A" && { icon: <Globe size={11} />, value: creator.country },
    creator.language !== "N/A" && { icon: <Languages size={11} />, value: creator.language },
    creator.ageRange !== "N/A" && { icon: null, value: creator.ageRange },
  ].filter(Boolean) as { icon: React.ReactNode; value: string }[];

  const hasPrice = creator.videoPrice && creator.videoPrice !== "N/A";
  const dramatic = teaMode && !!risk && risk.risk_score > 1;

  const stats = [
    {
      icon: <Users size={13} className="text-teal-400" />,
      label: "Subscribers",
      value: formatNumber(creator.totalSubscribers),
    },
    {
      icon: <DollarSign size={13} className="text-emerald-400" />,
      label: "Video Price",
      value: hasPrice ? `$${creator.videoPrice}` : "N/A",
    },
    {
      icon: <BarChart3 size={13} className="text-cyan-400" />,
      label: "Top Markets",
      value: extractHighestTopMarket(creator, risk),
    },
    {
      icon: <Users size={13} className="text-violet-400" />,
      label: "Gender",
      value: formatGender(risk),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: "easeOut" }}
      className={`relative card p-5 border transition-all duration-200 group ${
        dramatic
          ? "border-rose-500 bg-gradient-to-br from-rose-950 via-fuchsia-950 to-red-950 shadow-xl shadow-rose-900/40"
          : teaMode
            ? "border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 hover:shadow-xl"
            : "border-blue-100 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-lg"
      }`}
    >
      {/* Price badge */}
      {hasPrice && (
        <span className={`absolute top-3 right-3 font-bold text-xs rounded-full px-2.5 py-1 ${
          dramatic
            ? "bg-rose-500/20 border border-rose-400 text-rose-200"
            : teaMode
              ? "bg-emerald-500/20 border border-emerald-400 text-emerald-200"
              : "badge-emerald"
        }`}>
          ${creator.videoPrice}
        </span>
      )}

      {/* Top row */}
      <div className={`flex items-start gap-4 mb-4 pb-4 border-b ${teaMode ? "border-slate-700" : "border-slate-100"}`}>
        <CreatorAvatar url={creator.avatarUrl} name={creator.name} />
        <div className="flex-1 min-w-0 pr-16">
          <p className={`font-bold text-base leading-tight mb-1 truncate ${teaMode ? "text-slate-100" : "text-slate-900"}`}>
            <span className={`${teaMode ? "text-slate-500" : "text-slate-300"} mr-1.5 font-normal`}>{index}.</span>
            {creator.name}
          </p>
          <span className={`text-xs rounded-full px-2 py-0.5 font-semibold ${
            teaMode
              ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200"
              : "badge-brand"
          }`}>{creator.platform}</span>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chips.map((chip, i) => (
                <span key={i} className={`text-xs flex items-center gap-1 rounded-full px-2 py-0.5 ${
                  teaMode
                    ? "bg-slate-700 text-slate-200 border border-slate-600"
                    : "badge-slate"
                }`}>
                  {chip.icon}
                  {chip.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {dramatic && risk && (
        <div className="mb-4 rounded-xl border border-rose-400/60 bg-rose-900/50 p-3">
          <p className="text-xs uppercase tracking-wide font-bold text-rose-200 mb-1">
            Risk score: {risk.risk_score} ({risk.risk_level})
          </p>
          <p className="text-sm text-rose-100 mb-2">{risk.risk_finding}</p>
          <div className="flex flex-wrap gap-1.5">
            {risk.risk_keywords.map((kw) => (
              <span
                key={kw}
                className="text-sm font-semibold rounded-full px-3 py-1 bg-rose-500/30 border border-rose-300/60 text-rose-100"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats grid */}
      {(!teaMode || !dramatic) && (
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl p-3 flex flex-col gap-1 transition-colors ${
                teaMode
                  ? "bg-slate-800 border border-slate-700 group-hover:border-slate-600"
                  : "bg-white border border-slate-100 group-hover:border-slate-200"
              }`}
            >
              <span className={`flex items-center gap-1 text-xs font-medium ${teaMode ? "text-slate-400" : "text-slate-400"}`}>
                {s.icon}
                {s.label}
              </span>
              <span className={`text-sm font-semibold break-words leading-snug ${teaMode ? "text-slate-100" : "text-slate-800"}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FindCreatorsClient({
  teaMode,
  setTeaMode,
}: {
  teaMode: boolean;
  setTeaMode: (teaMode: boolean) => void;
}) {
  const [productType, setProductType] = useState(PRODUCT_TYPES[0]);
  const [budget, setBudget] = useState(Object.keys(BUDGET_OPTIONS)[0]);
  const [creatorCount, setCreatorCount] = useState(15);
  const [language, setLanguage] = useState("Any");
  const [location, setLocation] = useState("Any");
  const [gender, setGender] = useState("Any");
  const [ageGroup, setAgeGroup] = useState("Any");
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<Creator[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [teaLoading, setTeaLoading] = useState(false);
  const [teaError, setTeaError] = useState("");
  const [riskByChannel, setRiskByChannel] = useState<Record<string, CreatorRisk>>({});

  // Determine which form step is "active" for the step pills (always show all 3)
  const step = productType ? (budget ? 3 : 2) : 1;

  async function loadRiskMap(creators: Creator[]) {
    const res = await fetch("/api/creator-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelNames: creators.map((r) => r.name) }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error ?? "Failed to load risk data");
    }

    const mapped: Record<string, CreatorRisk> = {};
    for (const creator of creators) {
      const risk = data.risks?.[creator.name] as CreatorRisk | undefined;
      if (risk) {
        mapped[normalizeChannelName(creator.name)] = risk;
      }
    }
    setRiskByChannel(mapped);
  }

  async function handleSearch() {
    setSearching(true);
    setError("");
    setResults([]);
    setSource("");
    setTeaMode(false);
    setTeaError("");
    setRiskByChannel({});

    const [budgetMin, budgetMax] = BUDGET_OPTIONS[budget];
    const query: CreatorSearchQuery = {
      product_type: productType,
      budget: { label: budget, min: budgetMin, max: budgetMax },
      budget_per_creator: budgetMax / creatorCount,
      number_of_creators: creatorCount,
      filters: {
        language: language !== "Any" ? language : null,
        location: location !== "Any" ? location : null,
        gender: gender !== "Any" ? gender : null,
        age_group: ageGroup !== "Any" ? ageGroup : null,
      },
    };

    try {
      const res = await fetch("/api/find-creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Search failed");
      } else {
        setResults(data.creators);
        setSource(data.source ?? "");
        try {
          await loadRiskMap(data.creators);
        } catch {
          // Keep search usable even if risk dataset fails.
        }
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setSearching(false);
    }
  }

  async function handleSpillTheTea() {
    if (teaMode) {
      setTeaMode(false);
      return;
    }
    if (!results.length || teaLoading) return;
    setTeaError("");
    setTeaLoading(true);

    try {
      if (!Object.keys(riskByChannel).length) {
        await loadRiskMap(results);
      }
      setTeaMode(true);
    } catch (e) {
      setTeaError(String(e));
    } finally {
      setTeaLoading(false);
    }
  }

  return (
    <div className={`transition-colors duration-300 ${teaMode ? "text-slate-100" : ""}`}>
      {/* ── Form card ──────────────────────────────────────────────────────── */}
      <div
        className={`card p-6 mb-8 shadow-sm transition-colors duration-300 ${
          teaMode ? "bg-slate-900 border border-slate-700" : ""
        }`}
      >

        {/* Step pills */}
        <div className="flex items-center gap-2 mb-6">
          <StepPill number={1} label="Product Type" active={step >= 1} teaMode={teaMode} />
          <div className={`h-px flex-1 max-w-[32px] ${teaMode ? "bg-slate-700" : "bg-slate-200"}`} />
          <StepPill number={2} label="Budget" active={step >= 2} teaMode={teaMode} />
          <div className={`h-px flex-1 max-w-[32px] ${teaMode ? "bg-slate-700" : "bg-slate-200"}`} />
          <StepPill number={3} label="Creator Count" active={step >= 3} teaMode={teaMode} />
        </div>

        {/* Step 1 — Product type pill buttons */}
        <div className="mb-6">
          <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${teaMode ? "text-slate-300" : "text-slate-500"}`}>
            Step 1 · Product Type
          </p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map((pt) => (
              <button
                key={pt}
                onClick={() => setProductType(pt)}
                className={
                  productType === pt
                    ? "px-3.5 py-2 rounded-xl text-sm font-semibold bg-teal-600 text-white shadow-sm transition-all duration-150"
                    : `px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                        teaMode
                          ? "border-slate-700 bg-slate-800 text-slate-200 hover:border-teal-400 hover:text-teal-300"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600"
                      }`
                }
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Budget card buttons */}
        <div className="mb-6">
          <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${teaMode ? "text-slate-300" : "text-slate-500"}`}>
            Step 2 · Budget
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.keys(BUDGET_OPTIONS).map((key) => (
              <button
                key={key}
                onClick={() => setBudget(key)}
                className={`rounded-xl p-3 border-2 text-left transition-all duration-150 ${
                  budget === key
                    ? (teaMode ? "border-teal-400 bg-teal-900/20" : "border-teal-500 bg-teal-50")
                    : (teaMode ? "border-slate-700 bg-slate-800 hover:border-teal-400" : "border-slate-200 bg-white hover:border-teal-200")
                }`}
              >
                <p
                  className={`text-sm font-bold leading-tight ${
                    budget === key
                      ? (teaMode ? "text-teal-300" : "text-teal-700")
                      : (teaMode ? "text-slate-100" : "text-slate-700")
                  }`}
                >
                  {key.split(" (")[0]}
                </p>
                <p
                  className={`text-xs mt-0.5 font-medium ${
                    budget === key
                      ? (teaMode ? "text-teal-400" : "text-teal-500")
                      : (teaMode ? "text-slate-400" : "text-slate-400")
                  }`}
                >
                  {BUDGET_SUBLABELS[key]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3 — Creator count stepper */}
        <div className="mb-6">
          <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${teaMode ? "text-slate-300" : "text-slate-500"}`}>
            Step 3 · Number of Creators
          </p>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setCreatorCount((c) => Math.max(1, c - 1))}
              disabled={creatorCount <= 1}
              className={`w-9 h-9 rounded-xl border-2 font-bold text-lg flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 ${
                teaMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:border-teal-400 hover:text-teal-300"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              −
            </button>
            <span className={`text-2xl font-black w-8 text-center tabular-nums ${teaMode ? "text-slate-100" : "text-slate-900"}`}>
              {creatorCount}
            </span>
            <button
              onClick={() => setCreatorCount((c) => Math.min(15, c + 1))}
              disabled={creatorCount >= 15}
              className={`w-9 h-9 rounded-xl border-2 font-bold text-lg flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 ${
                teaMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:border-teal-400 hover:text-teal-300"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              +
            </button>
            <span className={`text-sm font-medium ml-1 ${teaMode ? "text-slate-400" : "text-slate-400"}`}>
              {creatorCount === 1 ? "creator" : "creators"}
            </span>
          </div>
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors mb-4 ${
            teaMode ? "text-slate-300 hover:text-slate-100" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <SlidersHorizontal size={15} />
          Advanced Filters (Optional)
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${showFilters ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 rounded-xl border ${
                  teaMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"
                }`}
              >
                {[
                  { label: "Language", value: language, onChange: setLanguage, options: LANGUAGES },
                  { label: "Location", value: location, onChange: setLocation, options: LOCATIONS },
                  { label: "Gender", value: gender, onChange: setGender, options: GENDERS },
                  { label: "Age Group", value: ageGroup, onChange: setAgeGroup, options: AGE_GROUPS },
                ].map(({ label, value, onChange, options }) => (
                  <div key={label}>
                    <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${teaMode ? "text-slate-300" : "text-slate-500"}`}>
                      {label}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className={`select-field ${teaMode ? "bg-slate-900 text-slate-100 border-slate-700" : ""}`}
                    >
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={searching}
            className="btn-primary-lg gap-2.5"
          >
            {searching ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Searching… this may take a moment
              </>
            ) : (
              <>
                <Search size={16} />
                Find Perfect Creators
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Results section ────────────────────────────────────────────────── */}
      <div className={`rounded-2xl transition-colors duration-300 ${teaMode ? "bg-slate-950 p-5 border border-slate-800" : ""}`}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className={`section-title ${teaMode ? "text-slate-100" : ""}`}>Recommended Creators</h2>
          {results.length > 0 && (
            <span className="badge-brand font-semibold">{results.length} found</span>
          )}
          {results.length > 0 && (
            <button
              onClick={handleSpillTheTea}
              disabled={teaLoading}
              className={`ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                teaMode
                  ? "bg-rose-500/20 border border-rose-300/40 text-rose-200"
                  : "bg-slate-900 text-rose-100 border border-slate-700 hover:bg-black"
              }`}
            >
              <Flame size={14} />
              {teaLoading ? "Spilling..." : teaMode ? "Tea spilled (click to reset)" : "Spill the tea"}
            </button>
          )}
        </div>

        {source && (
          <p className={`text-xs mb-4 flex items-center gap-1 ${teaMode ? "text-slate-300" : "text-slate-400"}`}>
            <Sparkles size={11} className="text-teal-300" />
            Source: {source}
          </p>
        )}

        {teaError && (
          <p className="text-xs text-rose-300 mb-3">{teaError}</p>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-rose-200 bg-rose-50 p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-700 font-semibold text-sm mb-1">Search failed</p>
                <pre className="text-xs text-rose-500 overflow-auto whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty / idle state */}
        {!error && results.length === 0 && !searching && (
          <div className="card p-14 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-teal-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">Ready to find your creators</p>
            <p className="text-sm text-slate-400">
              Configure your campaign requirements above and submit to discover matching creators.
            </p>
          </div>
        )}

        {/* Results grid */}
        <AnimatePresence>
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((creator, i) => (
                <CreatorCard
                  key={`${creator.channelId}-${i}`}
                  creator={creator}
                  index={i + 1}
                  delay={i}
                  teaMode={teaMode}
                  risk={riskByChannel[normalizeChannelName(creator.name)]}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10">
        <Link href="/" className="btn-secondary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
