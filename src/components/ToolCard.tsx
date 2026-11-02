import Link from "next/link";
import { ArrowUpRight, Calculator, CalendarDays, GraduationCap, Wallet } from "lucide-react";
import type { ToolSummary } from "@/data/tools";

const icons = {
  finans: Wallet,
  tarih: CalendarDays,
  egitim: GraduationCap,
  "gunluk-yasam": Calculator
};

export function ToolCard({ tool }: { tool: ToolSummary }) {
  const Icon = icons[tool.category];
  return (
    <Link href={`/${tool.id}`} className="tool-card group">
      <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pale-blue text-blue">
        <Icon size={21} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold text-navy">{tool.name}</span>
        <ArrowUpRight size={18} className="shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" aria-hidden="true" />
      </span>
      <span className="mt-2 block text-sm leading-6 text-slate-600">{tool.description}</span>
    </Link>
  );
}
