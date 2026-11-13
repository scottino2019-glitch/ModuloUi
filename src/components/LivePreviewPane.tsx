import React, { useState } from 'react';
import { Columns2, Monitor, RotateCcw, Rows2, Smartphone, Tablet } from 'lucide-react';
import { ComponentCatalogItem } from '../types/componentTypes';
import PreviewErrorBoundary from './PreviewErrorBoundary';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';
type BackdropMode = 'grid' | 'light' | 'dark';
export type WorkbenchLayout = 'stacked' | 'side-by-side';

interface LivePreviewPaneProps {
  item: ComponentCatalogItem;
  activeCss: string;
  CompiledComponent: React.ComponentType<Record<string, unknown>> | null;
  compileError: string | null;
  codeVersion: number;
  onResetCode: () => void;
  layoutMode: WorkbenchLayout;
  onToggleLayout: () => void;
}

export default function LivePreviewPane({
  item,
  activeCss,
  CompiledComponent,
  compileError,
  codeVersion,
  onResetCode,
  layoutMode,
  onToggleLayout,
}: LivePreviewPaneProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [backdrop, setBackdrop] = useState<BackdropMode>('grid');
  const [stateNonce, setStateNonce] = useState(0);

  const frameWidthClass =
    viewport === 'mobile'
      ? 'max-w-[390px]'
      : viewport === 'tablet'
      ? 'max-w-[768px]'
      : 'w-full';

  const stageBgClass =
    backdrop === 'dark'
      ? 'bg-slate-900'
      : backdrop === 'light'
      ? 'bg-slate-100'
      : 'preview-grid-bg';

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <style>{activeCss}</style>

      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 bg-slate-100 px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            Anteprima · {item.name}
          </span>
          <span className="hidden xl:inline text-sm text-slate-400" aria-hidden="true">
            ·
          </span>
          <span className="hidden xl:inline text-sm text-slate-600 truncate max-w-[300px]">
            {item.summary}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Responsive Viewport Switcher */}
          <div
            role="group"
            aria-label="Dimensione anteprima"
            className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Vista Desktop"
              aria-label="Vista Desktop"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              title="Vista Tablet (768px)"
              aria-label="Vista Tablet"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Vista Mobile (390px)"
              aria-label="Vista Mobile"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Backdrop Switcher */}
          <div
            role="group"
            aria-label="Sfondo anteprima"
            className="hidden sm:flex items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs font-medium"
          >
            {(
              [
                { id: 'grid', label: 'Griglia' },
                { id: 'light', label: 'Neutro' },
                { id: 'dark', label: 'Scuro' },
              ] as const
            ).map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => setBackdrop(bg.id)}
                className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                  backdrop === bg.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStateNonce((n) => n + 1)}
            title="Ricarica stato interno del componente"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">Ricarica</span>
          </button>

          <button
            type="button"
            onClick={onToggleLayout}
            title={
              layoutMode === 'side-by-side'
                ? 'Espandi anteprima a tutto schermo'
                : 'Torna a codice e anteprima affiancati'
            }
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
          >
            {layoutMode === 'side-by-side' ? (
              <>
                <Rows2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Espandi</span>
              </>
            ) : (
              <>
                <Columns2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Affianca</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div
        className={`studio-scroll relative flex-1 min-h-0 overflow-auto p-4 sm:p-5 transition-colors ${stageBgClass}`}
      >
        <div
          className={`mx-auto transition-all duration-200 ${frameWidthClass} ${
            viewport !== 'desktop'
              ? 'rounded-2xl border border-slate-400/60 bg-white/50 p-3 shadow-md'
              : ''
          }`}
        >
          {compileError ? (
            <div className="mx-auto max-w-lg rounded-xl border border-amber-300 bg-amber-50 p-5 text-left shadow-sm">
              <h4 className="text-sm font-semibold text-amber-950">
                In attesa di codice TSX valido
              </h4>
              <p className="mt-1.5 font-mono text-xs text-amber-900 break-words">
                {compileError}
              </p>
            </div>
          ) : CompiledComponent ? (
            <PreviewErrorBoundary
              resetKey={`${item.id}-${codeVersion}-${stateNonce}`}
              onResetCode={onResetCode}
            >
              <div
                className={
                  item.layoutHint === 'centered-card'
                    ? 'flex w-full justify-center py-2'
                    : 'w-full overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-md'
                }
              >
                <CompiledComponent key={`${item.id}-${stateNonce}`} />
              </div>
            </PreviewErrorBoundary>
          ) : null}
        </div>
      </div>
    </div>
  );
}
