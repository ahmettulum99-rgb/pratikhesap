import Link from "next/link";
import { Calculator, Menu } from "lucide-react";
import { categories } from "@/data/tools";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-page flex min-h-20 items-center justify-between gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-lg text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue" aria-label="PratikHesap ana sayfa">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue text-white">
            <Calculator size={23} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Pratik<span className="text-blue">Hesap</span></span>
        </Link>
        <nav aria-label="Ana navigasyon" className="hidden items-center gap-5 lg:flex">
          <Link href="/" className="nav-link">Ana Sayfa</Link>
          {categories.map((category) => <Link key={category.id} href={category.href} className="nav-link">{category.name}</Link>)}
          <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>
          <Link href="/iletisim" className="nav-link">İletişim</Link>
        </nav>
        <details className="relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-navy hover:bg-canvas" aria-label="Menüyü aç">
            <Menu size={21} aria-hidden="true" />
          </summary>
          <nav aria-label="Mobil navigasyon" className="absolute right-0 top-14 z-20 flex w-56 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-card">
            <Link href="/" className="mobile-nav-link">Ana Sayfa</Link>
            {categories.map((category) => <Link key={category.id} href={category.href} className="mobile-nav-link">{category.name}</Link>)}
            <Link href="/hakkimizda" className="mobile-nav-link">Hakkımızda</Link>
            <Link href="/iletisim" className="mobile-nav-link">İletişim</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
