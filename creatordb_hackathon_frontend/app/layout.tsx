import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "clearHub by CreatorDB", template: "%s · clearHub" },
  description: "AI-powered analytics tools that bring clear discovery to brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Navbar />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
