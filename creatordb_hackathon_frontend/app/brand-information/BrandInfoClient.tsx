"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_BRANDS = new Set([
  "adidas","apple","celine","chanel","clinique","dior","fendi","gucci",
  "h&m","lancome","maybelline","nike","nyx","prada","samsung","seiko",
  "shopee","temu","tissot","xiaomi","zara",
]);

function brandLogoPath(name: string): string | null {
  const key = name.toLowerCase();
  return LOGO_BRANDS.has(key) ? `/brand-logos/${key}.png` : null;
}

interface BrandEntry {
  description: string;
  category: string;
  attributes: string[];
}

interface Props {
  category: string;
  brands: Record<string, BrandEntry>;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function BrandInfoClient({ category, brands }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [maxReached, setMaxReached] = useState(false);

  const brandNames = Object.keys(brands);

  // Auto-dismiss max-reached toast after 2 seconds
  useEffect(() => {
    if (!maxReached) return;
    const timer = setTimeout(() => setMaxReached(false), 2000);
    return () => clearTimeout(timer);
  }, [maxReached]);

  function toggle(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) {
        return prev.filter((b) => b !== name);
      }
      if (prev.length >= 2) {
        setMaxReached(true);
        return prev;
      }
      return [...prev, name];
    });
  }

  async function handleCompare() {
    if (selected.length !== 2 || loading) return;
    setLoading(true);
    router.push(
      `/brands-comparison?brandA=${encodeURIComponent(selected[0])}&brandB=${encodeURIComponent(selected[1])}`
    );
  }

  const canCompare = selected.length === 2;
  const buttonLabel =
    selected.length === 2
      ? "Compare →"
      : `Select ${2 - selected.length} more`;

  return (
    <>
      {/* Max-reached toast */}
      <AnimatePresence>
        {maxReached && (
          <motion.div
            key="max-toast"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-50 card px-4 py-3 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 shadow-lg"
          >
            You can only compare 2 brands at a time
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-32"
      >
        {brandNames.map((name) => {
          const info = brands[name];
          const isSelected = selected.includes(name);
          const slotIndex = selected.indexOf(name); // -1 if not selected
          const slotLabel = slotIndex === 0 ? "A" : "B";

          const logoPath = brandLogoPath(name);

          return (
            <motion.div key={name} variants={cardVariants}>
              <button
                onClick={() => toggle(name)}
                className={[
                  "group relative text-left w-full rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-lg active:scale-[.98]",
                  isSelected
                    ? "border-teal-500 bg-teal-50/50 shadow-[0_0_0_3px_rgba(13,148,136,.15)]"
                    : "border-slate-200 bg-white hover:border-teal-200 hover:shadow-teal-50/50",
                ].join(" ")}
              >
                {/* Top row: avatar + selection badge */}
                <div className="flex items-start justify-between">
                  {/* Brand logo / initial avatar */}
                  {logoPath ? (
                    <div className={[
                      "w-12 h-12 rounded-xl overflow-hidden bg-white border transition-all duration-200 flex items-center justify-center",
                      isSelected ? "border-teal-300 shadow-sm shadow-teal-100" : "border-slate-100",
                    ].join(" ")}>
                      <Image
                        src={logoPath}
                        alt={name}
                        width={48}
                        height={48}
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className={[
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-200",
                        isSelected
                          ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-teal-50",
                      ].join(" ")}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Selection badge */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0"
                      >
                        {slotIndex + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Brand name */}
                <h3 className="font-bold text-slate-900 text-base mt-3 mb-1.5">
                  {name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
                  {info.description}
                </p>

                {/* Attribute tags */}
                <div className="flex flex-wrap gap-1.5">
                  {info.attributes.map((attr) => (
                    <span key={attr} className="badge-slate text-xs">
                      {attr}
                    </span>
                  ))}
                </div>

                {/* Bottom hint */}
                {isSelected ? (
                  <p className="text-xs font-semibold text-teal-600 mt-3">
                    Selected · Slot {slotLabel}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-3 group-hover:text-slate-600 transition-colors duration-150">
                    Click to select
                  </p>
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Sticky compare footer */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-100 bg-white/90 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {/* Slots */}
          <div className="flex-1 flex items-center gap-3">
            {/* Slot A */}
            <div
              className={[
                "flex-1 rounded-xl border-2 px-3 py-2 transition-all duration-200",
                selected[0]
                  ? "border-teal-200 bg-teal-50"
                  : "border-dashed border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Slot A
              </p>
              {selected[0] ? (
                <div className="flex items-center gap-1.5">
                  {brandLogoPath(selected[0]) && (
                    <Image
                      src={brandLogoPath(selected[0])!}
                      alt={selected[0]}
                      width={20}
                      height={20}
                      className="object-contain rounded shrink-0"
                      unoptimized
                    />
                  )}
                  <p className="text-sm font-bold text-slate-800 truncate">{selected[0]}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-300 font-normal">Empty</p>
              )}
            </div>

            {/* VS divider */}
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
              VS
            </div>

            {/* Slot B */}
            <div
              className={[
                "flex-1 rounded-xl border-2 px-3 py-2 transition-all duration-200",
                selected[1]
                  ? "border-rose-200 bg-rose-50"
                  : "border-dashed border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Slot B
              </p>
              {selected[1] ? (
                <div className="flex items-center gap-1.5">
                  {brandLogoPath(selected[1]) && (
                    <Image
                      src={brandLogoPath(selected[1])!}
                      alt={selected[1]}
                      width={20}
                      height={20}
                      className="object-contain rounded shrink-0"
                      unoptimized
                    />
                  )}
                  <p className="text-sm font-bold text-slate-800 truncate">{selected[1]}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-300 font-normal">Empty</p>
              )}
            </div>
          </div>

          {/* Compare button */}
          <button
            onClick={handleCompare}
            disabled={!canCompare || loading}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                Loading…
              </span>
            ) : (
              buttonLabel
            )}
          </button>
        </div>
      </div>
    </>
  );
}
