import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const activeComponent =
    components.find((c) => c.id === activeId) || components[0];

  useEffect(() => {
    if (!catalogOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [catalogOpen]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeBtn = container.querySelector('[aria-selected="true"]') as HTMLElement | null;
    if (activeBtn) {
      const targetLeft =
        activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [activeId]);

  const scrollStrip = (direction: -1 | 1) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
  };

  return (
    <div className="relative z-20 w-full border-b border-slate-300 bg-slate-200/80 shrink-0">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2.5 px-4 sm:px-6 py-2">
        {/* Compact Catalog Popover Trigger */}
        <div ref={popoverRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setCatalogOpen((o) => !o)}
            aria-expanded={catalogOpen}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 whitespace-nowrap cursor-pointer"
          >
            <span className="tabular-nums">Indice ({components.length})</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-300 transition-transform ${
                catalogOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {catalogOpen && (
            <div className="absolute left-0 top-full mt-2 w-[320px] sm:w-[500px] rounded-xl border border-slate-300 bg-white p-3.5 shadow-xl z-40">
              <div className="mb-2.5 flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
                {MOBILE_CATS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="max-h-[340px] overflow-y-auto studio-scroll grid grid-cols-2 sm:grid-cols-3 gap-2">
                {components.map((item) => {
                  const isSelected = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectComponent(item.id);
                        setCatalogOpen(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <div className="truncate">{item.name}</div>
                      <div
                        className={`text-xs truncate ${
                          isSelected ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {item.categoryLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Left scroll button */}
        <button
          type="button"
          onClick={() => scrollStrip(-1)}
          aria-label="Scorri componenti a sinistra"
          className="hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Single-row horizontal scrollable strip */}
        <div
          ref={scrollRef}
          role="tablist"
          aria-label="Seleziona componente"
          className="studio-scroll flex flex-1 min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto py-0.5"
        >
          {components.length === 0 ? (
            <span className="px-2 text-sm text-slate-700 whitespace-nowrap">
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
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-300/80 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </button>
              );
            })
          )}
        </div>

        {/* Right scroll button */}
        <button
          type="button"
          onClick={() => scrollStrip(1)}
          aria-label="Scorri componenti a destra"
          className="hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Active file metadata + search */}
        <div className="flex items-center gap-3 shrink-0">
          {activeComponent && (
            <span className="hidden xl:inline font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
              {activeComponent.fileName}
            </span>
          )}

          <div className="relative w-36 sm:w-48">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cerca..."
              aria-label="Cerca componente"
              className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
