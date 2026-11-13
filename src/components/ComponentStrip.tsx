import { Search } from 'lucide-react';
import { ComponentCatalogItem, ComponentCategory } from '../types/componentTypes';

interface ComponentStripProps {
  components: ComponentCatalogItem[];
  activeId: string;
  activeCategory: ComponentCategory;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: ComponentCategory) => void;
  onSelectComponent: (id: string) => void;
}

const MOBILE_CATS: { id: ComponentCategory; label: string }[] = [
  { id: 'all', label: 'Tutti' },
  { id: 'structure', label: 'Struttura' },
  { id: 'media', label: 'Media' },
  { id: 'interactive', label: 'Interattivi' },
  { id: 'forms-data', label: 'Moduli' },
];

export default function ComponentStrip({
  components,
  activeId,
  activeCategory,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectComponent,
}: ComponentStripProps) {
  const activeComponent =
    components.find((c) => c.id === activeId) || components[0];

  return (
    <div className="w-full border-b border-slate-200 bg-slate-50/80">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2.5 px-6 py-2.5">
        {/* Mobile category filter */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-1">
          {MOBILE_CATS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
          {/* Dedicated component selector menu (wraps cleanly on desktop, scrolls on mobile) */}
          <div
            role="tablist"
            aria-label="Seleziona componente"
            className="studio-scroll flex items-center gap-1 overflow-x-auto md:flex-wrap pb-0.5 flex-1"
          >
            {components.length === 0 ? (
              <span className="py-1 text-xs text-slate-500">
                Nessun componente trovato per &ldquo;{searchQuery}&rdquo;.
              </span>
            ) : (
              components.map((item) => {
                const isSelected = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => onSelectComponent(item.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })
            )}
          </div>

          {/* Search filter + unboxed active component metadata */}
          <div className="flex items-center justify-between gap-4 shrink-0">
            {activeComponent && (
              <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
                <span className="tabular-nums">{components.length} moduli</span>
                <span aria-hidden="true">·</span>
                <span>{activeComponent.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-slate-600">
                  {activeComponent.fileName}
                </span>
              </div>
            )}

            <div className="relative w-full sm:w-48">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cerca componente..."
                aria-label="Cerca componente"
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
