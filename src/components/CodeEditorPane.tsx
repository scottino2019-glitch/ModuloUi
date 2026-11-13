import React, { useRef } from 'react';

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

  const lines = code.split('\n');

  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
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
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Line numbers */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-slate-800 bg-slate-950/60 px-3 py-4 text-right font-mono text-xs leading-6 tabular-nums text-slate-500 w-12 shrink-0"
        >
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Editable monospace code surface */}
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
          className="studio-scroll flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-6 text-slate-100 placeholder:text-slate-500 focus:outline-none whitespace-pre overflow-auto"
        />
      </div>

      {compileError && (
        <div
          role="alert"
          className="border-t border-rose-900/60 bg-rose-950/90 px-4 py-2.5 font-mono text-xs text-rose-200"
        >
          <span className="font-semibold text-rose-100 mr-2">Errore sintassi:</span>
          <span>{compileError}</span>
        </div>
      )}
    </div>
  );
}
