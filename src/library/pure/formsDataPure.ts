export const DATA_TABLE_PURE = {
  tsx: `import React, { useMemo, useState } from 'react';

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
  onRowClick?: (row: Record<string, string | number>) => void;
  className?: string;
}

export default function DataTableCard({
  title = 'Registro elementi',
  columns = [
    { key: 'codice', label: 'Codice' },
    { key: 'nome', label: 'Nome elemento' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'valore', label: 'Indice', numeric: true },
  ],
  rows = [
    { codice: 'M-01', nome: 'Intestazione base', categoria: 'Struttura', valore: 14 },
    { codice: 'M-02', nome: 'Lettore audio', categoria: 'Media', valore: 28 },
    { codice: 'M-03', nome: 'Libro sfogliabile', categoria: 'Interattivi', valore: 42 },
    { codice: 'M-04', nome: 'Scheda dati', categoria: 'Moduli', valore: 19 },
    { codice: 'M-05', nome: 'Taccuino note', categoria: 'Interattivi', valore: 35 },
  ],
  searchable = true,
  onRowClick,
  className = '',
}: DataTableCardProps) {
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
    <div className={\`mui-table-card \${className}\`}>
      <div className="mui-table-top">
        <div>
          <h3 className="mui-table-title">{title}</h3>
          <p className="mui-table-count">{filteredRows.length} risultati</p>
        </div>
        {searchable && (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtra righe..."
            className="mui-table-search"
          />
        )}
      </div>

      <div className="mui-table-wrap">
        <table className="mui-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th key={col.key} className={col.numeric ? 'is-num' : ''}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={\`mui-table-sort \${isSorted ? 'is-active' : ''}\`}
                    >
                      <span>{col.label}</span>
                      <span className="mui-table-sort-icon">
                        {isSorted ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="mui-table-empty">
                  Nessun elemento corrisponde alla ricerca.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'is-clickable' : ''}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={col.numeric ? 'is-num' : ''}>
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
`,
  css: `.mui-table-card {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-table-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.mui-table-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-table-count {
  margin: 2px 0 0;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-table-search {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.82rem;
  width: 200px;
  outline: none;
}

.mui-table-search:focus {
  border-color: #2563eb;
}

.mui-table-wrap {
  overflow-x: auto;
}

.mui-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.mui-table th {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 11px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
}

.mui-table td {
  padding: 11px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #1e293b;
}

.mui-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.mui-table tbody tr:hover {
  background-color: #eff6ff;
}

.mui-table tbody tr.is-clickable {
  cursor: pointer;
}

.mui-table th.is-num,
.mui-table td.is-num {
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-variant-numeric: tabular-nums;
}

.mui-table-sort {
  background: transparent;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.mui-table-sort.is-active {
  color: #2563eb;
}

.mui-table-sort-icon {
  font-size: 0.7rem;
}

.mui-table-empty {
  text-align: center;
  padding: 28px;
  color: #94a3b8;
}
`,
};

export const ACCORDION_PURE = {
  tsx: `import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionListProps {
  title?: string;
  items?: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export default function AccordionList({
  title = 'Domande e chiarimenti',
  items = [
    {
      id: 'acc-1',
      question: 'Come si personalizzano i colori e lo stile?',
      answer:
        'Apri la scheda CSS nell’editor e modifica qualsiasi regola, colore, bordo, spaziatura o carattere direttamente sul foglio di stile puro.',
    },
    {
      id: 'acc-2',
      question: 'I componenti richiedono librerie esterne?',
      answer:
        'No, sono scritti in React puro e CSS standard, senza dipendenze esterne o vincoli.',
    },
    {
      id: 'acc-3',
      question: 'È possibile estendere i dati o i contenuti?',
      answer:
        'Puoi modificare direttamente il codice TSX o passare nuovi array e callback tramite props nel tuo progetto.',
    },
  ],
  allowMultiple = false,
  className = '',
}: AccordionListProps) {
  const [openIds, setOpenIds] = useState<string[]>(items[0] ? [items[0].id] : []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={\`mui-accordion \${className}\`}>
      {title && <h3 className="mui-accordion-title">{title}</h3>}

      <div className="mui-accordion-list">
        {items.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div key={item.id} className="mui-accordion-item">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(item.id)}
                className={\`mui-accordion-trigger \${isOpen ? 'is-open' : ''}\`}
              >
                <span>{item.question}</span>
                <span className="mui-accordion-icon">▾</span>
              </button>

              {isOpen && <div className="mui-accordion-panel">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`,
  css: `.mui-accordion {
  width: 100%;
  max-width: 560px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-accordion-title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-accordion-list {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.mui-accordion-item {
  border-bottom: 1px solid #e2e8f0;
}

.mui-accordion-item:last-child {
  border-bottom: none;
}

.mui-accordion-trigger {
  width: 100%;
  background: transparent;
  border: none;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  text-align: left;
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
}

.mui-accordion-trigger:hover {
  background-color: #f8fafc;
}

.mui-accordion-trigger.is-open {
  color: #2563eb;
}

.mui-accordion-icon {
  transition: transform 0.2s ease;
  color: #64748b;
}

.mui-accordion-trigger.is-open .mui-accordion-icon {
  transform: rotate(180deg);
  color: #2563eb;
}

.mui-accordion-panel {
  padding: 0 20px 18px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: #475569;
}
`,
};

export const TABS_PURE = {
  tsx: `import React, { useState } from 'react';

export interface TabSection {
  id: string;
  label: string;
  heading: string;
  content: string;
}

export interface TabsContainerProps {
  tabs?: TabSection[];
  onTabChange?: (tabId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function TabsContainer({
  tabs = [
    {
      id: 'panoramica',
      label: 'Panoramica',
      heading: 'Struttura modulare a schede',
      content:
        'Organizza contenuti correlati in viste separate mantenendo il contesto sullo stesso livello della pagina, evitando cambi di rotta superflui.',
    },
    {
      id: 'specifiche',
      label: 'Specifiche',
      heading: 'Proprietà configurabili',
      content:
        'Modifica facilmente i pannelli, aggiungi nuove schede o personalizza colori e bordi direttamente nel foglio di stile CSS.',
    },
    {
      id: 'note',
      label: 'Note',
      heading: 'Accessibilità da tastiera',
      content:
        "Utilizza attributi role='tablist' e aria-selected per garantire una lettura corretta agli screen reader.",
    },
  ],
  onTabChange,
  className = '',
  children,
}: TabsContainerProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || '');
  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  if (!activeTab) return null;

  const select = (id: string) => {
    setActiveId(id);
    onTabChange?.(id);
  };

  return (
    <div className={\`mui-tabs \${className}\`}>
      <div role="tablist" className="mui-tabs-list">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => select(tab.id)}
              className={\`mui-tabs-btn \${isActive ? 'is-active' : ''}\`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mui-tabs-panel">
        <h4 className="mui-tabs-heading">{activeTab.heading}</h4>
        <p className="mui-tabs-content">{activeTab.content}</p>
        {children && <div className="mui-tabs-slot">{children}</div>}
      </div>
    </div>
  );
}
`,
  css: `.mui-tabs {
  width: 100%;
  max-width: 560px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-tabs-list {
  display: inline-flex;
  gap: 4px;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 9px;
  margin-bottom: 18px;
}

.mui-tabs-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
}

.mui-tabs-btn:hover {
  color: #0f172a;
}

.mui-tabs-btn.is-active {
  background-color: #ffffff;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.mui-tabs-heading {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-tabs-content {
  margin: 8px 0 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #475569;
}

.mui-tabs-slot {
  margin-top: 14px;
}
`,
};

export const DIALOG_MODAL_PURE = {
  tsx: `import React, { useState } from 'react';

export interface DialogModalProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultOpen?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function DialogModal({
  triggerLabel = 'Apri finestra di dialogo',
  title = 'Conferma operazione',
  description = "Questa finestra modale generica può essere utilizzata per conferme, avvisi o moduli rapidi in qualsiasi punto dell'applicazione.",
  confirmLabel = 'Conferma',
  cancelLabel = 'Annulla',
  defaultOpen = true,
  onConfirm,
  onCancel,
  className = '',
  children,
}: DialogModalProps) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <div className={\`mui-modal-wrap \${className}\`}>
      <div className="mui-modal-trigger-box">
        <button
          type="button"
          onClick={() => {
            setStatusMessage(null);
            setOpen(true);
          }}
          className="mui-modal-btn-pri"
        >
          {triggerLabel}
        </button>
        {statusMessage && <p className="mui-modal-status">{statusMessage}</p>}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="mui-modal-card"
        >
          <div className="mui-modal-head">
            <h3 id="dialog-title" className="mui-modal-title">
              {title}
            </h3>
            <button
              type="button"
              aria-label="Chiudi"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
              className="mui-modal-close"
            >
              ✕
            </button>
          </div>

          {description && <p className="mui-modal-desc">{description}</p>}
          {children && <div className="mui-modal-slot">{children}</div>}

          <div className="mui-modal-foot">
            {cancelLabel && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatusMessage('Operazione annullata');
                  onCancel?.();
                }}
                className="mui-modal-btn-sec"
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
                className="mui-modal-btn-pri"
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
`,
  css: `.mui-modal-wrap {
  width: 100%;
  max-width: 500px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-modal-trigger-box {
  border: 1px dashed #cbd5e1;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.mui-modal-status {
  margin: 10px 0 0;
  font-size: 0.82rem;
  color: #475569;
}

.mui-modal-card {
  margin-top: 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.mui-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mui-modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-modal-close {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.mui-modal-close:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.mui-modal-desc {
  margin: 10px 0 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #475569;
}

.mui-modal-slot {
  margin-top: 14px;
}

.mui-modal-foot {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mui-modal-btn-pri {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-modal-btn-sec {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}
`,
};

export const SMART_FORM_PURE = {
  tsx: `import React, { useState } from 'react';

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
  onSubmit?: (values: Record<string, string>) => void;
  className?: string;
}

export default function SmartFormCard({
  title = 'Modulo raccolta dati',
  subtitle = 'Campi dinamici personalizzabili liberamente',
  fields = [
    { name: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Es. Marco Rossi', required: true },
    { name: 'email', label: 'Indirizzo email', type: 'email', placeholder: 'nome@esempio.it', required: true },
    {
      name: 'argomento',
      label: 'Tipologia richiesta',
      type: 'select',
      options: ['Informazioni generali', 'Segnalazione tecnica', 'Proposta editoriale'],
    },
    { name: 'messaggio', label: 'Note aggiuntive', type: 'textarea', placeholder: 'Scrivi qui i dettagli...' },
  ],
  submitLabel = 'Invia modulo',
  successMessage = 'Dati registrati correttamente.',
  onSubmit,
  className = '',
}: SmartFormCardProps) {
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
      <div className={\`mui-form-card is-done \${className}\`}>
        <p className="mui-form-success">{successMessage}</p>
        <p className="mui-form-sub">Tutti i campi compilati sono pronti per essere elaborati.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mui-form-btn-sec"
        >
          Compila di nuovo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={\`mui-form-card \${className}\`}>
      <div>
        <h3 className="mui-form-title">{title}</h3>
        {subtitle && <p className="mui-form-sub">{subtitle}</p>}
      </div>

      <div className="mui-form-fields">
        {fields.map((field) => (
          <div key={field.name} className="mui-form-group">
            <label htmlFor={\`field-\${field.name}\`} className="mui-form-label">
              {field.label}
              {field.required && <span className="mui-form-req">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={\`field-\${field.name}\`}
                rows={3}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className="mui-form-control"
              />
            ) : field.type === 'select' ? (
              <select
                id={\`field-\${field.name}\`}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className="mui-form-control"
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
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className="mui-form-control"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mui-form-foot">
        <button type="submit" className="mui-form-btn-pri">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
`,
  css: `.mui-form-card {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-form-card.is-done {
  text-align: center;
}

.mui-form-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-form-sub {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.mui-form-success {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #15803d;
}

.mui-form-fields {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mui-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mui-form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
}

.mui-form-req {
  color: #dc2626;
  margin-left: 3px;
}

.mui-form-control {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: inherit;
  font-size: 0.88rem;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
}

.mui-form-control:focus {
  border-color: #2563eb;
}

.mui-form-foot {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.mui-form-btn-pri {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-form-btn-sec {
  margin-top: 16px;
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}
`,
};
