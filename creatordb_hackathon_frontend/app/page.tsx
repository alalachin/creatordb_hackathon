"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STATS = [
  { value: "12", label: "Saved Reports" },
  { value: "15", label: "Demo Creators" },
  { value: "Static", label: "Data Mode" },
];

const FEATURE_CARDS = [
  {
    href: "/entity-explorer",
    icon: "📊",
    title: "clearCompetitors",
    description:
      "For large brands to gain automatic insights of competitors — see which creators they're activating, audience demographics, and estimated spend.",
    badge: "For Large Brands",
    badgeClass: "badge-brand",
  },
  {
    href: "/find-creators",
    icon: "🎬",
    title: "clearCreators",
    description:
      "For small brands to find suitable creators with ease of mind — surface the perfect influencers using real-time filters.",
    badge: "For Small Brands",
    badgeClass: "badge-violet",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden mesh-bg">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-8%] w-[480px] h-[480px] rounded-full bg-teal-400 blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[420px] h-[420px] rounded-full bg-cyan-400 blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[30%] w-[360px] h-[360px] rounded-full bg-teal-300 blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[280px] h-[280px] rounded-full bg-amber-400 blur-3xl opacity-20 pointer-events-none" />

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <span className="badge-brand inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Static Demo · No live AI calls
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="page-title mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The Influencer{" "}
          <span className="gradient-text">Intelligence</span>
          {" "}Platform
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore clearHub using saved reports and creator data. This public demo
          makes no live AI calls.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          className="card-glass rounded-2xl px-8 py-5 w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-extrabold text-slate-900 text-xl leading-none">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wide text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Feature Cards Section ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-20 px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="section-title mb-3">Everything in one platform</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            From competitive intelligence to creator activation — replacing endless search
            with AI-powered filters and guardrails.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <Link href={card.href} className="group block h-full">
                <div className="card-hover p-6 h-full flex flex-col gap-4">
                  {/* Gradient icon container */}
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-teal-100 shrink-0">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    {card.description}
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-2">
                    <span className={card.badgeClass}>{card.badge}</span>
                    <span className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-200 font-semibold text-lg leading-none">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <motion.p
        className="relative z-10 mt-16 text-xs text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        clearHub by CreatorDB · Static public demo
      </motion.p>
    </div>
  );
}
