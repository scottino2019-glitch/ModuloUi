export const BREADCRUMBS_TEMPLATE = `import React, { useState } from 'react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface BreadcrumbTrailProps {
  items?: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  showHomeIcon?: boolean;
  collapseMiddle?: boolean;
  accentColor?: string;
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: BreadcrumbTrailProps = {
  items: [
    { id: "home", label: "Archivio", href: "#archivio" },
    { id: "sezione", label: "Documentazione", href: "#docs" },
    { id: "categoria", label: "Componenti base", href: "#componenti" },
    { id: "pagina", label: "Navigazione gerarchica" }
  ],
  separator: "chevron",
  showHomeIcon: true,
  collapseMiddle: false,
  accentColor: "#2563eb"
};

export default function BreadcrumbTrail(props: BreadcrumbTrailProps) {
  const {
    items = DEFAULT_PROPS.items ?? [],
    separator = DEFAULT_PROPS.separator,
    showHomeIcon = DEFAULT_PROPS.showHomeIcon,
    collapseMiddle = DEFAULT_PROPS.collapseMiddle,
    accentColor = DEFAULT_PROPS.accentColor,
    onNavigate,
    className = '',
  } = props;

  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = collapseMiddle && !expanded && items.length > 3;
  const visibleItems: (BreadcrumbItem | { id: '__ellipsis__'; label: string })[] =
    shouldCollapse
      ? [items[0], { id: '__ellipsis__', label: '…' }, items[items.length - 1]]
      : items;

  const renderSeparator = () => {
    if (separator === 'slash') {
      return <span className="text-slate-300 select-none" aria-hidden="true">/</span>;
    }
    if (separator === 'dot') {
      return <span className="text-slate-300 select-none" aria-hidden="true">·</span>;
    }
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-300 shrink-0"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  };

  return (
    <nav
      aria-label="Percorso di navigazione"
      className={\`w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 \${className}\`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {visibleItems.map((item, idx) => {
          const isLast = idx === visibleItems.length - 1;

          if (item.id === '__ellipsis__') {
            return (
              <React.Fragment key="ellipsis">
                <li className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    title="Mostra percorso completo"
                    className="rounded px-1.5 py-0.5 text-xs font-mono text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  >
                    ...
                  </button>
                </li>
                {!isLast && <li className="flex items-center">{renderSeparator()}</li>}
              </React.Fragment>
            );
          }

          const realIdx = items.findIndex((x) => x.id === item.id);

          return (
            <React.Fragment key={item.id}>
              <li className="flex items-center gap-1.5 min-w-0">
                {idx === 0 && showHomeIcon && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-400 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    style={{ color: accentColor }}
                    className="font-semibold truncate"
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href || '#'}
                    onClick={(e) => {
                      if (!item.href || item.href.startsWith('#')) e.preventDefault();
                      onNavigate?.(item as BreadcrumbItem, realIdx);
                    }}
                    className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors truncate"
                  >
                    {item.label}
                  </a>
                )}
              </li>

              {!isLast && <li className="flex items-center">{renderSeparator()}</li>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
`;

export const SIDEBAR_TEMPLATE = `import React, { useState } from 'react';

export interface SidebarLink {
  id: string;
  label: string;
  meta?: string;
}

export interface SidebarSection {
  heading: string;
  items: SidebarLink[];
}

export interface SidebarDrawerProps {
  title?: string;
  sections?: SidebarSection[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  footerNote?: string;
  accentColor?: string;
  onSelect?: (item: SidebarLink) => void;
  className?: string;
}

export const DEFAULT_PROPS: SidebarDrawerProps = {
  title: "Spazio di lavoro",
  sections: [
    {
      heading: "Principali",
      items: [
        { id: "riepilogo", label: "Riepilogo", meta: "12" },
        { id: "progetti", label: "Raccolte", meta: "4" },
        { id: "note", label: "Annotazioni" }
      ]
    },
    {
      heading: "Strumenti",
      items: [
        { id: "modelli", label: "Modelli base" },
        { id: "archivio", label: "Archivio locale" },
        { id: "impostazioni", label: "Preferenze" }
      ]
    }
  ],
  collapsible: true,
  defaultCollapsed: false,
  footerNote: "Struttura modulare estensibile",
  accentColor: "#2563eb"
};

export default function SidebarDrawer(props: SidebarDrawerProps) {
  const {
    title = DEFAULT_PROPS.title,
    sections = DEFAULT_PROPS.sections ?? [],
    collapsible = DEFAULT_PROPS.collapsible,
    defaultCollapsed = DEFAULT_PROPS.defaultCollapsed,
    footerNote = DEFAULT_PROPS.footerNote,
    accentColor = DEFAULT_PROPS.accentColor,
    onSelect,
    className = '',
  } = props;

  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));
  const [activeId, setActiveId] = useState(
    sections[0]?.items[0]?.id || 'riepilogo'
  );

  return (
    <aside
      aria-label={title || 'Barra laterale'}
      className={\`flex flex-col justify-between rounded-xl border border-slate-200 bg-white transition-all duration-200 \${
        collapsed ? 'w-20' : 'w-full max-w-[270px]'
      } \${className}\`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
          {!collapsed && (
            <span className="text-sm font-semibold text-slate-900 truncate">
              {title}
            </span>
          )}
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Espandi barra laterale' : 'Comprimi barra laterale'}
              className="mx-auto mr-0 rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={\`transition-transform \${collapsed ? 'rotate-180' : ''}\`}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-3 space-y-5">
          {sections.map((section, sIdx) => (
            <div key={\`\${section.heading}-\${sIdx}\`}>
              {!collapsed && (
                <div className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-wide text-slate-400">
                  {section.heading}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        title={item.label}
                        onClick={() => {
                          setActiveId(item.id);
                          onSelect?.(item);
                        }}
                        style={
                          isActive
                            ? { color: accentColor, backgroundColor: '#f8fafc' }
                            : undefined
                        }
                        className={\`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors cursor-pointer \${
                          isActive
                            ? 'font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }\`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span
                            style={
                              isActive
                                ? { backgroundColor: accentColor }
                                : undefined
                            }
                            className={\`h-1.5 w-1.5 rounded-full shrink-0 \${
                              isActive ? '' : 'bg-slate-300'
                            }\`}
                            aria-hidden="true"
                          />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </span>
                        {!collapsed && item.meta && (
                          <span className="font-mono text-xs tabular-nums text-slate-400 shrink-0">
                            {item.meta}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {!collapsed && footerNote && (
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          {footerNote}
        </div>
      )}
    </aside>
  );
}
`;
