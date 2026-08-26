"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/entity-explorer", label: "clearCompetitors" },
  { href: "/find-creators",   label: "clearCreators" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: .4, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 nav-glass ${isHome ? "bg-transparent border-transparent backdrop-blur-none" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-shadow">
            <span className="text-white text-xs font-black">C</span>
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">
            clear<span className="text-teal-600">Hub</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-teal-600 bg-teal-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-teal-50/70 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/find-creators"
          className="btn-primary text-xs px-3.5 py-2 hidden sm:inline-flex"
        >
          Start Free
        </Link>
      </div>
    </motion.header>
  );
}
