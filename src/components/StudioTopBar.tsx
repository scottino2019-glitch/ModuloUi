import { Download } from 'lucide-react';
import { ComponentCategory } from '../types/componentTypes';

interface StudioTopBarProps {
  activeCategory: ComponentCategory;
  onSelectCategory: (category: ComponentCategory) => void;
  onDownload: () => void;
  activeFileName: string;
}

const CATEGORIES: { id: ComponentCategory; label: string }[] = [
  { id: 'all', label: 'Tutti' },
  { id: 'structure', label: 'Struttura' },
  { id: 'media', label: 'Media & Visual' },
  { id: 'interactive', label: 'Interattivi' },
  { id: 'forms-data', label: 'Moduli & Dati' },
];

export default function StudioTopBar({
  activeCategory,
  onSelectCategory,
  onDownload,
  activeFileName,
}: StudioTopBarProps) {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900 text-white shrink-0">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-8 px-4 sm:px-6 py-3">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('all');
          }}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Modulo UI
        </a>

        <nav
          aria-label="Categorie componenti"
          className="hidden md:flex items-center gap-6"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 pb-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white border-b-2 border-blue-400'
                    : 'text-slate-300 hover:text-white border-b-2 border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onDownload}
            title={`Scarica ${activeFileName}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Scarica .tsx</span>
          </button>
        </div>
      </div>
    </header>
  );
}
