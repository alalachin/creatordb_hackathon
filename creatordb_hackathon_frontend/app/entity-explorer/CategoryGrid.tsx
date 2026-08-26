"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CATEGORY_ICONS: Record<string, string> = {
  Luxury: "💎",
  Sportswear: "👟",
  Cosmetics: "💄",
  Skincare: "✨",
  Smartphone: "📱",
  "E-commerce": "🛍️",
  Watch: "⌚",
  Retails: "🏪",
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "🏷️";
}

interface Props {
  categories: string[];
  brandCounts: Record<string, number>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryGrid({ categories, brandCounts }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? categories.filter((cat) =>
        cat.toLowerCase().includes(search.trim().toLowerCase())
      )
    : categories;

  return (
    <div className="flex flex-col gap-5">
      {/* Search input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none select-none">
          🔍
        </span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-slate-400 text-sm">
            No categories match &ldquo;{search}&rdquo;
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((cat) => {
            const icon = getCategoryIcon(cat);
            const count = brandCounts[cat] ?? 0;

            return (
              <motion.div
                key={cat}
                variants={itemVariants}
                className="card-hover relative overflow-hidden p-4 cursor-pointer text-left group flex flex-col gap-3"
                onClick={() =>
                  router.push(
                    `/brand-information?category=${encodeURIComponent(cat)}`
                  )
                }
              >
                {/* Icon box */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center text-2xl transition-colors duration-200">
                  {icon}
                </div>

                {/* Category name */}
                <span className="font-semibold text-sm text-slate-800 leading-snug">
                  {cat}
                </span>

                {/* Brand count badge */}
                <span className="badge-slate self-start">
                  {count} {count === 1 ? "brand" : "brands"}
                </span>

                {/* Bottom gradient underline */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
