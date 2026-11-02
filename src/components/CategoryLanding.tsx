import type { CategoryId } from "@/data/tools";
import { categories, tools } from "@/data/tools";
import { Breadcrumb } from "./Breadcrumb";
import { ToolExplorer } from "./ToolExplorer";

export function CategoryLanding({ categoryId }: { categoryId: CategoryId }) {
  const category = categories.find((item) => item.id === categoryId)!;
  const categoryTools = tools.filter((tool) => tool.category === categoryId);
  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: category.name }]} path={category.href} />
      <header className="max-w-3xl">
        <p className="eyebrow">{category.name} araçları</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{category.name} hesaplama araçları</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{category.description} Tüm işlemler tarayıcınızda, ücretsiz olarak hesaplanır.</p>
      </header>
      <section className="mt-9" aria-label={`${category.name} hesaplama araçları`}>
        <ToolExplorer tools={categoryTools} showSearch={false} initialCategory={categoryId} />
      </section>
    </div>
  );
}
