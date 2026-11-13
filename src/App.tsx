import { useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, RotateCcw, SlidersHorizontal, Terminal } from 'lucide-react';
import ComponentStrip from './components/ComponentStrip';
import CodeEditorPane from './components/CodeEditorPane';
import LivePreviewPane from './components/LivePreviewPane';
import PropsInspectorPane from './components/PropsInspectorPane';
import StudioTopBar from './components/StudioTopBar';
import { COMPONENT_CATALOG } from './library/registry';
import { ComponentCategory, PropValues } from './types/componentTypes';
import { compileTsxComponent } from './utils/liveCompiler';
import { buildUsageSnippet, syncDefaultPropsInSource } from './utils/propsSync';

type EditorTab = 'code' | 'props' | 'usage';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(COMPONENT_CATALOG[0].id);
  const [editorTab, setEditorTab] = useState<EditorTab>('code');
  const [copied, setCopied] = useState(false);
  const [codeVersion, setCodeVersion] = useState(0);

  const [codeById, setCodeById] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of COMPONENT_CATALOG) {
      initial[item.id] = item.sourceCode;
    }
    return initial;
  });

  const [propsById, setPropsById] = useState<Record<string, PropValues>>(() => {
    const initial: Record<string, PropValues> = {};
    for (const item of COMPONENT_CATALOG) {
      initial[item.id] = structuredClone(item.defaultProps);
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
  const activeProps = propsById[activeItem.id] ?? activeItem.defaultProps;

  const compileResult = useMemo(
    () => compileTsxComponent(activeCode),
    [activeCode]
  );

  const usageSnippet = useMemo(
    () =>
      buildUsageSnippet(
        activeItem.componentName,
        activeItem.fileName,
        activeProps
      ),
    [activeItem.componentName, activeItem.fileName, activeProps]
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

    const parsed = compileTsxComponent(nextCode);
    if (parsed.defaultProps) {
      setPropsById((prev) => ({
        ...prev,
        [activeItem.id]: parsed.defaultProps!,
      }));
    }
  };

  const handlePropChange = (key: string, value: unknown) => {
    const nextProps: PropValues = {
      ...activeProps,
      [key]: value,
    };
    setPropsById((prev) => ({ ...prev, [activeItem.id]: nextProps }));
    setCodeById((prev) => {
      const current = prev[activeItem.id] ?? activeItem.sourceCode;
      return {
        ...prev,
        [activeItem.id]: syncDefaultPropsInSource(current, nextProps),
      };
    });
    setCodeVersion((v) => v + 1);
  };

  const handleResetActive = () => {
    setCodeById((prev) => ({
      ...prev,
      [activeItem.id]: activeItem.sourceCode,
    }));
    setPropsById((prev) => ({
      ...prev,
      [activeItem.id]: structuredClone(activeItem.defaultProps),
    }));
    setCodeVersion((v) => v + 1);
  };

  const handleDownloadTsx = () => {
    const blob = new Blob([activeCode], {
      type: 'text/typescript;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeItem.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const textToCopy = editorTab === 'usage' ? usageSnippet : activeCode;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for restricted clipboard contexts
    }
  };

  return (
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden flex-col bg-slate-50 text-slate-900">
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

      {/* Main Split Workbench: Editor & Live Preview */}
      <main className="mx-auto grid w-full max-w-[1600px] flex-1 min-h-0 grid-cols-1 lg:grid-cols-12">
        {/* Left Pane: Editor */}
        <section
          aria-label="Editor componente"
          className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white lg:col-span-5 min-h-[480px] lg:min-h-0"
        >
          {/* Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/70 px-4 py-2">
            <div
              role="tablist"
              aria-label="Modalità editor"
              className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'code'}
                onClick={() => setEditorTab('code')}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  editorTab === 'code'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Codice TSX</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'props'}
                onClick={() => setEditorTab('props')}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  editorTab === 'props'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Props</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'usage'}
                onClick={() => setEditorTab('usage')}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  editorTab === 'usage'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Uso</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                title="Copia negli appunti"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
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
                title="Ripristina codice e props predefiniti"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Ripristina</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTsx}
                title={`Scarica ${activeItem.fileName}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{activeItem.fileName}</span>
              </button>
            </div>
          </div>

          {/* Active Editor Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {editorTab === 'code' && (
              <CodeEditorPane
                code={activeCode}
                onChange={handleCodeChange}
                compileError={compileResult.error}
              />
            )}

            {editorTab === 'props' && (
              <PropsInspectorPane
                key={activeItem.id}
                schema={activeItem.propSchema}
                values={activeProps}
                onChangeProp={handlePropChange}
              />
            )}

            {editorTab === 'usage' && (
              <CodeEditorPane
                code={usageSnippet}
                onChange={() => {}}
                compileError={null}
                readOnly
              />
            )}
          </div>
        </section>

        {/* Right Pane: Real-time Preview */}
        <section
          aria-label="Anteprima dal vivo"
          className="flex flex-col bg-white lg:col-span-7 min-h-[500px] lg:min-h-0"
        >
          <LivePreviewPane
            item={activeItem}
            CompiledComponent={compileResult.Component}
            compileError={compileResult.error}
            propValues={compileResult.defaultProps ? activeProps : {}}
            codeVersion={codeVersion}
            onResetCode={handleResetActive}
          />
        </section>
      </main>
    </div>
  );
}
