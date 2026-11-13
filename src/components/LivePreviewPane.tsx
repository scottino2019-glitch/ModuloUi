import React, { useState } from 'react';
import { Monitor, RotateCcw, Smartphone, Tablet } from 'lucide-react';
import { ComponentCatalogItem, PropValues } from '../types/componentTypes';
import PreviewErrorBoundary from './PreviewErrorBoundary';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';
type BackdropMode = 'light' | 'grid' | 'dark';

interface LivePreviewPaneProps {
  item: ComponentCatalogItem;
  CompiledComponent: React.ComponentType<Record<string, unknown>> | null;
  compileError: string | null;
  propValues: PropValues;
  codeVersion: number;
  onResetCode: () => void;
}

export default function LivePreviewPane({
  item,
  CompiledComponent,
  compileError,
  propValues,
  codeVersion,
  onResetCode,
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
      ? 'bg-white'
      : 'preview-grid-bg';

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-800">
            Anteprima in tempo reale
          </span>
          <span className="hidden sm:inline text-xs text-slate-400" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 truncate max-w-[260px]">
            {item.summary}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Responsive Viewport Switcher */}
          <div
            role="group"
            aria-label="Dimensione anteprima"
            className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Vista Desktop"
              aria-label="Vista Desktop"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              title="Vista Tablet (768px)"
              aria-label="Vista Tablet"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Vista Mobile (390px)"
              aria-label="Vista Mobile"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Backdrop Switcher */}
          <div
            role="group"
            aria-label="Sfondo anteprima"
            className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-[11px] font-medium"
          >
            {(
              [
                { id: 'grid', label: 'Griglia' },
                { id: 'light', label: 'Chiaro' },
                { id: 'dark', label: 'Scuro' },
              ] as const
            ).map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => setBackdrop(bg.id)}
                className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                  backdrop === bg.id
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Ricarica</span>
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div
        className={`studio-scroll relative flex-1 overflow-auto p-6 md:p-8 transition-colors ${stageBgClass}`}
      >
        <div
          className={`mx-auto transition-all duration-200 ${frameWidthClass} ${
            viewport !== 'desktop'
              ? 'rounded-2xl border border-slate-300/80 bg-white/40 p-3 shadow-sm'
              : ''
          }`}
        >
          {compileError ? (
            <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-5 text-left">
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
                    ? 'flex w-full justify-center py-4'
                    : 'w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs'
                }
              >
                <CompiledComponent
                  key={`${item.id}-${stateNonce}`}
                  {...propValues}
                />
              </div>
            </PreviewErrorBoundary>
          ) : null}
        </div>
      </div>
    </div>
  );
}
