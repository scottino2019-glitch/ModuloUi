import { useEffect, useState } from 'react';
import { PropFieldSchema, PropValues } from '../types/componentTypes';

interface PropsInspectorPaneProps {
  schema: PropFieldSchema[];
  values: PropValues;
  onChangeProp: (key: string, value: unknown) => void;
}

const ACCENT_PRESETS = [
  { label: 'Cobalto', hex: '#2563eb' },
  { label: 'Ardesia', hex: '#0f172a' },
  { label: 'Smeraldo', hex: '#059669' },
  { label: 'Ambra', hex: '#d97706' },
  { label: 'Cremisi', hex: '#dc2626' },
];

function JsonFieldEditor({
  field,
  value,
  onChange,
}: {
  field: PropFieldSchema;
  value: unknown;
  onChange: (nextVal: unknown) => void;
}) {
  const [draft, setDraft] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(JSON.stringify(value ?? [], null, 2));
    setJsonError(null);
  }, [value]);

  const handleTextChange = (text: string) => {
    setDraft(text);
    try {
      const parsed = JSON.parse(text);
      setJsonError(null);
      onChange(parsed);
    } catch {
      setJsonError('JSON non valido: controlla parentesi e virgolette.');
    }
  };

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={6}
        spellCheck={false}
        className="studio-scroll w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
      />
      {jsonError && (
        <p className="mt-1 text-xs text-rose-600">{jsonError}</p>
      )}
      {field.description && !jsonError && (
        <p className="mt-1 text-[11px] text-slate-500">{field.description}</p>
      )}
    </div>
  );
}

export default function PropsInspectorPane({
  schema,
  values,
  onChangeProp,
}: PropsInspectorPaneProps) {
  return (
    <div className="studio-scroll h-full overflow-y-auto bg-white p-5">
      <div className="space-y-5">
        {schema.map((field) => {
          const currentVal = values[field.key];

          return (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`prop-${field.key}`}
                  className="text-xs font-semibold text-slate-800"
                >
                  {field.label}
                </label>
                <span className="font-mono text-[11px] text-slate-400">
                  {field.key}
                </span>
              </div>

              {field.type === 'string' && (
                <input
                  id={`prop-${field.key}`}
                  type="text"
                  value={String(currentVal ?? '')}
                  onChange={(e) => onChangeProp(field.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  id={`prop-${field.key}`}
                  rows={3}
                  value={String(currentVal ?? '')}
                  onChange={(e) => onChangeProp(field.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              )}

              {field.type === 'select' && (
                <select
                  id={`prop-${field.key}`}
                  value={String(currentVal ?? '')}
                  onChange={(e) => onChangeProp(field.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'boolean' && (
                <button
                  id={`prop-${field.key}`}
                  type="button"
                  role="switch"
                  aria-checked={Boolean(currentVal)}
                  onClick={() => onChangeProp(field.key, !currentVal)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left transition-colors hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-xs text-slate-600">
                    {Boolean(currentVal) ? 'Attivo' : 'Disattivo'}
                  </span>
                  <span
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      Boolean(currentVal) ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        Boolean(currentVal) ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>
              )}

              {field.type === 'number' && (
                <div className="flex items-center gap-3">
                  <input
                    id={`prop-${field.key}`}
                    type="range"
                    min={field.min ?? 0}
                    max={field.max ?? 100}
                    step={field.step ?? 1}
                    value={Number(currentVal ?? 0)}
                    onChange={(e) => onChangeProp(field.key, Number(e.target.value))}
                    className="flex-1 cursor-pointer accent-blue-600"
                  />
                  <span className="w-14 text-right font-mono text-xs tabular-nums text-slate-700">
                    {Number(currentVal ?? 0)}s
                  </span>
                </div>
              )}

              {field.type === 'color' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id={`prop-${field.key}`}
                      type="color"
                      value={String(currentVal ?? '#2563eb')}
                      onChange={(e) => onChangeProp(field.key, e.target.value)}
                      className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-slate-200 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={String(currentVal ?? '#2563eb')}
                      onChange={(e) => onChangeProp(field.key, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => onChangeProp(field.key, preset.hex)}
                        title={preset.label}
                        style={{ backgroundColor: preset.hex }}
                        className={`h-5 w-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                          String(currentVal).toLowerCase() === preset.hex
                            ? 'ring-2 ring-offset-2 ring-slate-900 border-white'
                            : 'border-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {field.type === 'json' && (
                <JsonFieldEditor
                  field={field}
                  value={currentVal}
                  onChange={(nextVal) => onChangeProp(field.key, nextVal)}
                />
              )}

              {field.description && field.type !== 'json' && (
                <p className="text-[11px] text-slate-500">{field.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
