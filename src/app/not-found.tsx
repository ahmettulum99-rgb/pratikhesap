import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[55vh] place-content-center py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue">404 · Sayfa bulunamadı</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">Aradığınız sayfaya ulaşamadık.</h1>
      <p className="mt-3 max-w-lg text-slate-600">Adres değişmiş veya sayfa kaldırılmış olabilir. Ana sayfadan ihtiyacınız olan hesaplama aracını bulabilirsiniz.</p>
      <Link href="/" className="primary-button mx-auto mt-6">Ana sayfaya dön</Link>
    </main>
  );
}
