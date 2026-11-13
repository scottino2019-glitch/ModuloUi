export const DATA_TABLE_TEMPLATE = `import React, { useMemo, useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

export interface DataTableCardProps {
  title?: string;
  columns?: TableColumn[];
  rows?: Record<string, string | number>[];
  searchable?: boolean;
  striped?: boolean;
  accentColor?: string;
  onRowClick?: (row: Record<string, string | number>) => void;
  className?: string;
}

export const DEFAULT_PROPS: DataTableCardProps = {
  title: "Registro elementi",
  columns: [
    { key: "codice", label: "Codice" },
    { key: "nome", label: "Nome elemento" },
    { key: "categoria", label: "Categoria" },
    { key: "valore", label: "Indice", numeric: true }
  ],
  rows: [
    { codice: "M-01", nome: "Intestazione base", categoria: "Struttura", valore: 14 },
    { codice: "M-02", nome: "Lettore audio", categoria: "Media", valore: 28 },
    { codice: "M-03", nome: "Libro sfogliabile", categoria: "Interattivi", valore: 42 },
    { codice: "M-04", nome: "Scheda dati", categoria: "Moduli", valore: 19 },
    { codice: "M-05", nome: "Taccuino note", categoria: "Interattivi", valore: 35 }
  ],
  searchable: true,
  striped: true,
  accentColor: "#2563eb"
};

export default function DataTableCard(props: DataTableCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    columns = DEFAULT_PROPS.columns ?? [],
    rows = DEFAULT_PROPS.rows ?? [],
    searchable = DEFAULT_PROPS.searchable,
    striped = DEFAULT_PROPS.striped,
    accentColor = DEFAULT_PROPS.accentColor,
    onRowClick,
    className = '',
  } = props;

  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rows.filter((row) =>
          Object.values(row).some((val) => String(val).toLowerCase().includes(q))
        )
      : rows;

    if (!sortKey) return base;
    return [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, query, sortKey, sortDir]);

  return (
    <div className={\`w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden \${className}\`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
            {filteredRows.length} risultati
          </p>
        </div>
        {searchable && (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtra righe..."
            className="w-full sm:w-52 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={\`px-4 py-3 \${col.numeric ? 'text-right' : 'text-left'}\`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      style={isSorted ? { color: accentColor } : undefined}
                      className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                    >
                      <span>{col.label}</span>
                      <span className="font-mono text-[10px]">
                        {isSorted ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-xs text-slate-400"
                >
                  Nessun elemento corrisponde alla ricerca.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={\`transition-colors hover:bg-slate-50 \${
                    striped && idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                  } \${onRowClick ? 'cursor-pointer' : ''}\`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={\`px-4 py-2.5 text-xs \${
                        col.numeric
                          ? 'text-right font-mono tabular-nums text-slate-700'
                          : 'text-slate-800'
                      }\`}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

export const ACCORDION_TEMPLATE = `import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionListProps {
  title?: string;
  items?: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'bordered' | 'separated' | 'minimal';
  accentColor?: string;
  className?: string;
}

export const DEFAULT_PROPS: AccordionListProps = {
  title: "Domande e chiarimenti",
  items: [
    {
      id: "acc-1",
      question: "Come si personalizzano i colori e le varianti?",
      answer: "Ogni componente accetta proprietà tipizzate come accentColor, variant e className per integrarsi facilmente con qualsiasi tema."
    },
    {
      id: "acc-2",
      question: "I componenti richiedono librerie esterne?",
      answer: "No, sono costruiti esclusivamente con React e classi Tailwind CSS standard, senza dipendenze aggiuntive."
    },
    {
      id: "acc-3",
      question: "È possibile estendere i dati o i contenuti?",
      answer: "Tutte le liste, schede e colonne sono passate tramite array di oggetti tipizzati e supportano slot children."
    }
  ],
  allowMultiple: false,
  variant: "bordered",
  accentColor: "#2563eb"
};

export default function AccordionList(props: AccordionListProps) {
  const {
    title = DEFAULT_PROPS.title,
    items = DEFAULT_PROPS.items ?? [],
    allowMultiple = DEFAULT_PROPS.allowMultiple,
    variant = DEFAULT_PROPS.variant,
    accentColor = DEFAULT_PROPS.accentColor,
    className = '',
  } = props;

  const [openIds, setOpenIds] = useState<string[]>(items[0] ? [items[0].id] : []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={\`w-full max-w-xl \${className}\`}>
      {title && (
        <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      )}

      <div
        className={
          variant === 'separated'
            ? 'space-y-2.5'
            : variant === 'minimal'
            ? 'divide-y divide-slate-200'
            : 'divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden'
        }
      >
        {items.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={
                variant === 'separated'
                  ? 'rounded-xl border border-slate-200 bg-white overflow-hidden'
                  : ''
              }
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <span style={isOpen ? { color: accentColor } : undefined}>
                  {item.question}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={\`shrink-0 text-slate-400 transition-transform duration-200 \${
                    isOpen ? 'rotate-180' : ''
                  }\`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;

export const TABS_TEMPLATE = `import React, { useState } from 'react';

export interface TabSection {
  id: string;
  label: string;
  heading: string;
  content: string;
}

export interface TabsContainerProps {
  tabs?: TabSection[];
  variant?: 'underline' | 'segmented' | 'vertical';
  accentColor?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: TabsContainerProps = {
  tabs: [
    {
      id: "panoramica",
      label: "Panoramica",
      heading: "Struttura modulare a schede",
      content: "Organizza contenuti correlati in viste separate mantenendo il contesto sullo stesso livello della pagina, evitando cambi di rotta superflui."
    },
    {
      id: "specifiche",
      label: "Specifiche",
      heading: "Proprietà configurabili",
      content: "Supporta orientamento orizzontale, controllo segmentato oppure disposizione verticale laterale per pannelli di documentazione."
    },
    {
      id: "note",
      label: "Note",
      heading: "Accessibilità da tastiera",
      content: "Utilizza attributi role='tablist' e aria-selected per garantire una lettura corretta agli screen reader."
    }
  ],
  variant: "segmented",
  accentColor: "#2563eb"
};

export default function TabsContainer(props: TabsContainerProps) {
  const {
    tabs = DEFAULT_PROPS.tabs ?? [],
    variant = DEFAULT_PROPS.variant,
    accentColor = DEFAULT_PROPS.accentColor,
    onTabChange,
    className = '',
    children,
  } = props;

  const [activeId, setActiveId] = useState(tabs[0]?.id || '');
  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  if (!activeTab) return null;

  const select = (id: string) => {
    setActiveId(id);
    onTabChange?.(id);
  };

  return (
    <div
      className={\`w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${
        variant === 'vertical' ? 'flex flex-col sm:flex-row gap-6' : ''
      } \${className}\`}
    >
      <div
        role="tablist"
        className={
          variant === 'vertical'
            ? 'flex sm:flex-col gap-1 sm:w-40 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3'
            : variant === 'segmented'
            ? 'inline-flex rounded-lg bg-slate-100 p-1 mb-5'
            : 'flex items-center gap-5 border-b border-slate-200 mb-5'
        }
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => select(tab.id)}
              style={
                isActive && variant === 'underline'
                  ? { color: accentColor, borderBottomColor: accentColor }
                  : isActive && variant === 'vertical'
                  ? { color: accentColor, backgroundColor: '#f8fafc' }
                  : undefined
              }
              className={\`text-xs font-medium transition-colors whitespace-nowrap cursor-pointer \${
                variant === 'segmented'
                  ? isActive
                    ? 'rounded-md bg-white px-3.5 py-1.5 text-slate-900 shadow-xs'
                    : 'rounded-md px-3.5 py-1.5 text-slate-600 hover:text-slate-900'
                  : variant === 'vertical'
                  ? \`rounded-lg px-3 py-2 text-left \${
                      isActive ? 'font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }\`
                  : \`pb-2.5 border-b-2 \${
                      isActive
                        ? 'font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }\`
              }\`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="flex-1">
        <h4 className="text-base font-semibold text-slate-900">
          {activeTab.heading}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {activeTab.content}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
`;

export const DIALOG_MODAL_TEMPLATE = `import React, { useState } from 'react';

export interface DialogModalProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultOpen?: boolean;
  accentColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: DialogModalProps = {
  triggerLabel: "Apri finestra di dialogo",
  title: "Conferma operazione",
  description: "Questa finestra modale generica può essere utilizzata per conferme, avvisi o moduli rapidi in qualsiasi punto dell'applicazione.",
  confirmLabel: "Conferma",
  cancelLabel: "Annulla",
  defaultOpen: true,
  accentColor: "#2563eb"
};

export default function DialogModal(props: DialogModalProps) {
  const {
    triggerLabel = DEFAULT_PROPS.triggerLabel,
    title = DEFAULT_PROPS.title,
    description = DEFAULT_PROPS.description,
    confirmLabel = DEFAULT_PROPS.confirmLabel,
    cancelLabel = DEFAULT_PROPS.cancelLabel,
    defaultOpen = DEFAULT_PROPS.defaultOpen,
    accentColor = DEFAULT_PROPS.accentColor,
    onConfirm,
    onCancel,
    className = '',
    children,
  } = props;

  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <div className={\`w-full max-w-lg \${className}\`}>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
        <button
          type="button"
          onClick={() => {
            setStatusMessage(null);
            setOpen(true);
          }}
          style={{ backgroundColor: accentColor }}
          className="rounded-lg px-4 py-2 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
        >
          {triggerLabel}
        </button>
        {statusMessage && (
          <p className="mt-2.5 text-xs text-slate-600">{statusMessage}</p>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 id="dialog-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <button
              type="button"
              aria-label="Chiudi"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}

          {children && <div className="mt-4">{children}</div>}

          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            {cancelLabel && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatusMessage('Operazione annullata');
                  onCancel?.();
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {cancelLabel}
              </button>
            )}
            {confirmLabel && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatusMessage('Azione confermata');
                  onConfirm?.();
                }}
                style={{ backgroundColor: accentColor }}
                className="rounded-lg px-4 py-2 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;

export const SMART_FORM_TEMPLATE = `import React, { useState } from 'react';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface SmartFormCardProps {
  title?: string;
  subtitle?: string;
  fields?: FormFieldConfig[];
  submitLabel?: string;
  successMessage?: string;
  accentColor?: string;
  onSubmit?: (values: Record<string, string>) => void;
  className?: string;
}

export const DEFAULT_PROPS: SmartFormCardProps = {
  title: "Modulo raccolta dati",
  subtitle: "Campi dinamici configurabili tramite schema JSON",
  fields: [
    { name: "nome", label: "Nome completo", type: "text", placeholder: "Es. Marco Rossi", required: true },
    { name: "email", label: "Indirizzo email", type: "email", placeholder: "nome@esempio.it", required: true },
    {
      name: "argomento",
      label: "Tipologia richiesta",
      type: "select",
      options: ["Informazioni generali", "Segnalazione tecnica", "Proposta editoriale"]
    },
    { name: "messaggio", label: "Note aggiuntive", type: "textarea", placeholder: "Scrivi qui i dettagli..." }
  ],
  submitLabel: "Invia modulo",
  successMessage: "Dati registrati correttamente.",
  accentColor: "#2563eb"
};

export default function SmartFormCard(props: SmartFormCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    subtitle = DEFAULT_PROPS.subtitle,
    fields = DEFAULT_PROPS.fields ?? [],
    submitLabel = DEFAULT_PROPS.submitLabel,
    successMessage = DEFAULT_PROPS.successMessage,
    accentColor = DEFAULT_PROPS.accentColor,
    onSubmit,
    className = '',
  } = props;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.name] = f.type === 'select' && f.options?.length ? f.options[0] : '';
    });
    return init;
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit?.(values);
  };

  if (submitted) {
    return (
      <div className={\`w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm \${className}\`}>
        <p className="text-sm font-semibold text-slate-900">{successMessage}</p>
        <p className="mt-1 text-xs text-slate-500">
          Tutti i campi compilati sono pronti per essere elaborati.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Compila di nuovo
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={\`w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm \${className}\`}
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label
              htmlFor={\`field-\${field.name}\`}
              className="block text-xs font-medium text-slate-700"
            >
              {field.label}
              {field.required && <span className="text-rose-600 ml-0.5">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={\`field-\${field.name}\`}
                rows={3}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            ) : field.type === 'select' ? (
              <select
                id={\`field-\${field.name}\`}
                value={values[field.name] ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none cursor-pointer"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={\`field-\${field.name}\`}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          style={{ backgroundColor: accentColor }}
          className="rounded-lg px-5 py-2.5 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
`;
