"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  brandA: string;
  brandB: string;
}

type Status = "idle" | "loading" | "done" | "error";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LOGO_BRANDS = new Set([
  "adidas","apple","celine","chanel","clinique","dior","fendi","gucci",
  "h&m","lancome","maybelline","nike","nyx","prada","samsung","seiko",
  "shopee","temu","tissot","xiaomi","zara",
]);

function brandLogoPath(name: string): string | null {
  const key = name.toLowerCase();
  return LOGO_BRANDS.has(key) ? `/brand-logos/${key}.png` : null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BrandBox({ name, variant }: { name: string; variant: "teal" | "rose" }) {
  const logoPath = brandLogoPath(name);
  const styles =
    variant === "teal"
      ? "rounded-xl border-2 border-teal-200 bg-teal-50 px-4 py-2.5 font-bold text-teal-700"
      : "rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2.5 font-bold text-rose-700";
  return (
    <span className={`${styles} inline-flex items-center gap-2`}>
      {logoPath && (
        <Image src={logoPath} alt={name} width={28} height={28}
          className="object-contain rounded" unoptimized />
      )}
      {name}
    </span>
  );
}

function StepRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${
      done ? "text-emerald-600" : "text-slate-400"
    }`}>
      {done ? (
        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
      ) : (
        <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin shrink-0" />
      )}
      <span className={done ? "font-semibold" : "font-medium"}>{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComparisonClient({ brandA, brandB }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const started = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-start on mount (once, even in React 18 strict mode)
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inject HTML into iframe when report is ready
  useEffect(() => {
    if (status === "done" && iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [status, html]);

  function clearProgressInterval() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function generate() {
    setStatus("loading");
    setProgress(0);
    setError("");
    setHtml("");

    // Simulate progress ticking to 85 over ~5 minutes (tick every 2s, +1-2% per tick)
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) { clearProgressInterval(); return prev; }
        return Math.min(prev + Math.floor(Math.random() * 2) + 1, 85);
      });
    }, 2000);

    try {
      const res = await fetch("/api/compare-brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandA, brandB }),
      });
      const data = await res.json();

      clearProgressInterval();

      if (!res.ok || data.error) {
        setError(data.error ?? "Unknown error");
        setStatus("error");
        return;
      }

      setProgress(100);
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      setHtml(data.html);
      setStatus("done");
    } catch (e) {
      clearProgressInterval();
      setError(String(e));
      setStatus("error");
    }
  }

  const generatedAt = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="card p-10 text-center animate-fade-in">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Generating report
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          Analysing{" "}
          <span className="text-teal-600">{brandA}</span>
          {" "}vs{" "}
          <span className="text-rose-600">{brandB}</span>
        </h2>

        <div className="flex items-center justify-center gap-4 mb-8">
          <BrandBox name={brandA} variant="teal" />
          <span className="text-sm font-bold text-slate-400 px-1">VS</span>
          <BrandBox name={brandB} variant="rose" />
        </div>

        <div className="max-w-xs mx-auto mb-3">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-sm font-bold text-teal-600 tabular-nums mb-6">{progress}%</p>

        <div className="flex flex-col items-center gap-3 text-left max-w-xs mx-auto">
          <StepRow done={progress > 20} label="📊 Loading demographics" />
          <StepRow done={progress > 50} label="🤖 Generating analysis" />
          <StepRow done={progress > 80} label="✨ Finalising report" />
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="card border-rose-200 bg-rose-50 p-8 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-rose-500" />
        </div>
        <p className="text-rose-700 font-bold text-lg mb-1">Failed to generate report</p>
        <p className="text-sm text-rose-500 mb-4">
          Something went wrong while analysing {brandA} vs {brandB}.
        </p>
        <pre className="text-xs text-rose-500 bg-rose-100 rounded-xl p-3 text-left overflow-auto max-h-40 mb-6">
          {error}
        </pre>
        <button onClick={generate} className="btn-primary mx-auto">
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  if (status === "done") {
    return (
      <div className="animate-fade-in">
        {/* Nav row */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/brand-information"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Selection
          </Link>
        </div>

        {/* Brand comparison header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <BrandBox name={brandA} variant="teal" />
          <span className="text-sm font-extrabold text-slate-400 px-1">VS</span>
          <BrandBox name={brandB} variant="rose" />
        </div>

        {/* Report meta */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="badge-emerald font-semibold">AI Generated Report</span>
          <span className="text-xs text-slate-400">{generatedAt}</span>
        </div>

        {/* Report card */}
        <div className="card overflow-hidden shadow-lg">
          {/* Browser chrome */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 border border-slate-200 truncate">
              clearHub/report/{brandA.toLowerCase().replace(/\s+/g, "-")}-
              {brandB.toLowerCase().replace(/\s+/g, "-")}
            </span>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full"
            style={{ height: "80vh", border: "none" }}
            title={`${brandA} vs ${brandB} — clearCompetitors Report`}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return null;
}
