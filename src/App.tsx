import { useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, Paintbrush, RotateCcw } from 'lucide-react';
import ComponentStrip from './components/ComponentStrip';
import CodeEditorPane from './components/CodeEditorPane';
import LivePreviewPane, { WorkbenchLayout } from './components/LivePreviewPane';
import StudioTopBar from './components/StudioTopBar';
import { COMPONENT_CATALOG } from './library/registry';
import { ComponentCategory } from './types/componentTypes';
import { compileTsxComponent } from './utils/liveCompiler';

type EditorTab = 'tsx' | 'css';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(COMPONENT_CATALOG[0].id);
  const [editorTab, setEditorTab] = useState<EditorTab>('tsx');
  const [layoutMode, setLayoutMode] = useState<WorkbenchLayout>('side-by-side');
  const [copied, setCopied] = useState(false);
  const [codeVersion, setCodeVersion] = useState(0);

  const [codeById, setCodeById] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of COMPONENT_CATALOG) {
      initial[item.id] = item.sourceCode;
    }
    return initial;
  });

  const [cssById, setCssById] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of COMPONENT_CATALOG) {
      initial[item.id] = item.cssCode;
    }
    return initial;
  });

  const visibleComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COMPONENT_CATALOG.filter((item) => {
      const catOk = activeCategory === 'all' || item.category === activeCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.componentName.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const activeItem = useMemo(() => {
    return (
      COMPONENT_CATALOG.find((item) => item.id === activeId) ||
      visibleComponents[0] ||
      COMPONENT_CATALOG[0]
    );
  }, [activeId, visibleComponents]);

  const activeCode = codeById[activeItem.id] ?? activeItem.sourceCode;
  const activeCss = cssById[activeItem.id] ?? activeItem.cssCode;

  const compileResult = useMemo(
    () => compileTsxComponent(activeCode),
    [activeCode]
  );

  const handleSelectCategory = (category: ComponentCategory) => {
    setActiveCategory(category);
    const matching =
      category === 'all'
        ? COMPONENT_CATALOG
        : COMPONENT_CATALOG.filter((c) => c.category === category);
    if (matching.length > 0 && !matching.some((c) => c.id === activeId)) {
      setActiveId(matching[0].id);
    }
  };

  const handleCodeChange = (nextCode: string) => {
    setCodeById((prev) => ({ ...prev, [activeItem.id]: nextCode }));
    setCodeVersion((v) => v + 1);
  };

  const handleCssChange = (nextCss: string) => {
    setCssById((prev) => ({ ...prev, [activeItem.id]: nextCss }));
  };

  const handleResetActive = () => {
    setCodeById((prev) => ({
      ...prev,
      [activeItem.id]: activeItem.sourceCode,
    }));
    setCssById((prev) => ({
      ...prev,
      [activeItem.id]: activeItem.cssCode,
    }));
    setCodeVersion((v) => v + 1);
  };

  const triggerDownload = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTsx = () => {
    triggerDownload(activeCode, activeItem.fileName, 'text/typescript;charset=utf-8');
  };

  const handleDownloadCss = () => {
    triggerDownload(activeCss, activeItem.cssFileName, 'text/css;charset=utf-8');
  };

  const handleCopy = async () => {
    const textToCopy = editorTab === 'css' ? activeCss : activeCode;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for restricted clipboard contexts
    }
  };

  const isSideBySide = layoutMode === 'side-by-side';

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-200 text-slate-900">
      <StudioTopBar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onDownload={handleDownloadTsx}
        activeFileName={activeItem.fileName}
      />

      <ComponentStrip
        components={visibleComponents}
        activeId={activeItem.id}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        onSelectComponent={setActiveId}
      />

      {/* Side-by-side 50/50 split fitting exact remaining viewport height */}
      <main
        className={`mx-auto w-full max-w-[1600px] flex-1 min-h-0 p-2.5 sm:p-3.5 gap-3 ${
          isSideBySide
            ? 'grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 overflow-hidden'
            : 'flex flex-col overflow-auto'
        }`}
      >
        {/* Left Pane: Pure TSX & Pure CSS Editor */}
        <section
          aria-label="Editor codice componente"
          className={`flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm min-h-0 ${
            isSideBySide ? 'h-full' : 'hidden'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 bg-slate-100 px-3 py-2 shrink-0">
            <div
              role="tablist"
              aria-label="Schede codice"
              className="flex items-center gap-0.5 rounded-lg bg-slate-200 p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'tsx'}
                onClick={() => setEditorTab('tsx')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  editorTab === 'tsx'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>React TSX</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'css'}
                onClick={() => setEditorTab('css')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  editorTab === 'css'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Paintbrush className="h-3.5 w-3.5" aria-hidden="true" />
                <span>CSS</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                title="Copia codice negli appunti"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700">Copiato</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copia</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetActive}
                title="Ripristina TSX e CSS originali"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">Ripristina</span>
              </button>

              <button
                type="button"
                onClick={editorTab === 'css' ? handleDownloadCss : handleDownloadTsx}
                title={
                  editorTab === 'css'
                    ? `Scarica ${activeItem.cssFileName}`
                    : `Scarica ${activeItem.fileName}`
                }
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {editorTab === 'css' ? activeItem.cssFileName : activeItem.fileName}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {editorTab === 'tsx' ? (
              <CodeEditorPane
                code={activeCode}
                onChange={handleCodeChange}
                compileError={compileResult.error}
              />
            ) : (
              <CodeEditorPane
                code={activeCss}
                onChange={handleCssChange}
                compileError={null}
              />
            )}
          </div>
        </section>

        {/* Right Pane: Real-time Preview */}
        <section
          aria-label="Anteprima dal vivo"
          className="flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm h-full min-h-0"
        >
          <LivePreviewPane
            item={activeItem}
            activeCss={activeCss}
            CompiledComponent={compileResult.Component}
            compileError={compileResult.error}
            codeVersion={codeVersion}
            onResetCode={handleResetActive}
            layoutMode={layoutMode}
            onToggleLayout={() =>
              setLayoutMode((m) => (m === 'side-by-side' ? 'stacked' : 'side-by-side'))
            }
          />
        </section>
      </main>
    </div>
  );
}
