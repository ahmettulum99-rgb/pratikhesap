import Link from "next/link";
import { categories } from "@/data/tools";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-10 md:grid-cols-3">
        <div>
          <Link href="/" className="text-lg font-extrabold tracking-tight text-navy">Pratik<span className="text-blue">Hesap</span></Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Hesaplamak artık çok kolay. Günlük ihtiyaçlarınız için ücretsiz ve pratik hesaplama araçları.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-navy">Kategoriler</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
            {categories.map((category) => <li key={category.id}><Link className="hover:text-blue" href={category.href}>{category.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold text-navy">PratikHesap</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-blue" href="/hakkimizda">Hakkımızda</Link></li>
            <li><Link className="hover:text-blue" href="/iletisim">İletişim</Link></li>
            <li><Link className="hover:text-blue" href="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <p className="container-page py-4 text-xs text-slate-500">© {new Date().getFullYear()} PratikHesap. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
