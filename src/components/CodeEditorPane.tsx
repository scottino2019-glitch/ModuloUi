import React, { useRef, useState } from 'react';

interface CodeEditorPaneProps {
  code: string;
  onChange: (nextCode: string) => void;
  compileError: string | null;
  readOnly?: boolean;
}

export default function CodeEditorPane({
  code,
  onChange,
  compileError,
  readOnly = false,
}: CodeEditorPaneProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordWrap, setWordWrap] = useState(true);

  const lines = code.split('\n');

  const handleScroll = () => {
    if (!wordWrap && gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.slice(0, start) + '  ' + code.slice(end);
      onChange(updated);
      window.requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300 shrink-0">
        <span className="font-mono tabular-nums">{lines.length} righe</span>
        <button
          type="button"
          onClick={() => setWordWrap((w) => !w)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
            wordWrap
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {wordWrap ? 'A capo: Attivo' : 'A capo: Disattivo'}
        </button>
      </div>

      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {!wordWrap && (
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="select-none overflow-hidden border-r border-slate-800 bg-slate-900/90 px-3.5 py-4 text-right font-mono text-sm leading-6 tabular-nums text-slate-500 w-14 shrink-0"
          >
            {lines.map((_, idx) => (
              <div key={idx}>{idx + 1}</div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={code}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Editor codice TSX"
          className={`studio-scroll h-full w-full flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 placeholder:text-slate-500 focus:outline-none overflow-auto ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
          }`}
        />
      </div>

      {compileError && (
        <div
          role="alert"
          className="border-t border-rose-800 bg-rose-950 px-4 py-3 font-mono text-xs text-rose-200 shrink-0"
        >
          <span className="font-semibold text-rose-100 mr-2">Errore sintassi:</span>
          <span>{compileError}</span>
        </div>
      )}
    </div>
  );
}
