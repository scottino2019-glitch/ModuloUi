export const HEADER_TEMPLATE = `import React, { useState } from 'react';

export interface HeaderLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface SiteHeaderProps {
  brandName?: string;
  brandHref?: string;
  links?: HeaderLink[];
  actionLabel?: string;
  showAction?: boolean;
  variant?: 'bordered' | 'elevated' | 'minimal';
  alignment?: 'between' | 'center' | 'left';
  sticky?: boolean;
  accentColor?: string;
  onNavigate?: (link: HeaderLink, index: number) => void;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: SiteHeaderProps = {
  brandName: "Atlante",
  brandHref: "#inizio",
  links: [
    { label: "Panoramica", href: "#panoramica", active: true },
    { label: "Archivio", href: "#archivio" },
    { label: "Documenti", href: "#documenti" },
    { label: "Risorse", href: "#risorse" }
  ],
  actionLabel: "Inizia ora",
  showAction: true,
  variant: "bordered",
  alignment: "between",
  sticky: false,
  accentColor: "#2563eb"
};

export default function SiteHeader(props: SiteHeaderProps) {
  const {
    brandName = DEFAULT_PROPS.brandName,
    brandHref = DEFAULT_PROPS.brandHref,
    links = DEFAULT_PROPS.links ?? [],
    actionLabel = DEFAULT_PROPS.actionLabel,
    showAction = DEFAULT_PROPS.showAction,
    variant = DEFAULT_PROPS.variant,
    alignment = DEFAULT_PROPS.alignment,
    sticky = DEFAULT_PROPS.sticky,
    accentColor = DEFAULT_PROPS.accentColor,
    onNavigate,
    onAction,
    className = '',
    children,
  } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = links.findIndex((item) => item.active);
    return idx >= 0 ? idx : 0;
  });

  const surfaceClasses =
    variant === 'elevated'
      ? 'bg-white shadow-sm border-b border-slate-100'
      : variant === 'minimal'
      ? 'bg-transparent'
      : 'bg-white border-b border-slate-200';

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: HeaderLink,
    idx: number
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(link, idx);
    } else if (link.href.startsWith('#')) {
      e.preventDefault();
    }
    setActiveIndex(idx);
    setMobileOpen(false);
  };

  return (
    <header
      className={\`w-full transition-colors \${surfaceClasses} \${
        sticky ? 'sticky top-0 z-30 backdrop-blur-md bg-white/90' : ''
      } \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href={brandHref}
          onClick={(e) => brandHref?.startsWith('#') && e.preventDefault()}
          className="text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          {brandName}
        </a>

        <nav
          aria-label="Navigazione principale"
          className={\`hidden md:flex items-center gap-6 \${
            alignment === 'left'
              ? 'mr-auto'
              : alignment === 'center'
              ? 'mx-auto'
              : ''
          }\`}
        >
          {links.map((link, idx) => {
            const isActive = idx === activeIndex;
            return (
              <a
                key={\`\${link.label}-\${idx}\`}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link, idx)}
                style={isActive ? { color: accentColor } : undefined}
                className={\`text-sm font-medium whitespace-nowrap shrink-0 transition-colors pb-0.5 \${
                  isActive
                    ? 'border-b-2'
                    : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                }\`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {children}
          {showAction && actionLabel && (
            <button
              type="button"
              onClick={onAction}
              style={{ backgroundColor: accentColor }}
              className="hidden md:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {actionLabel}
            </button>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Chiudi menù' : 'Apri menù'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-3">
            {links.map((link, idx) => {
              const isActive = idx === activeIndex;
              return (
                <a
                  key={\`mobile-\${link.label}-\${idx}\`}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link, idx)}
                  style={isActive ? { color: accentColor } : undefined}
                  className={\`py-1.5 text-sm font-medium \${
                    isActive ? 'font-semibold' : 'text-slate-600'
                  }\`}
                >
                  {link.label}
                </a>
              );
            })}
            {showAction && actionLabel && (
              <button
                type="button"
                onClick={() => {
                  onAction?.();
                  setMobileOpen(false);
                }}
                style={{ backgroundColor: accentColor }}
                className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white cursor-pointer"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
`;

export const HERO_TEMPLATE = `import React, { useState } from 'react';

export interface HeroSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  showSecondaryCta?: boolean;
  layout?: 'centered' | 'split-right' | 'split-left';
  surface?: 'light' | 'muted' | 'dark';
  imageUrl?: string;
  imageAlt?: string;
  accentColor?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: HeroSectionProps = {
  eyebrow: "Sistema modulare",
  title: "Strutture essenziali per progetti editoriali e digitali",
  description: "Un punto di partenza pulito, flessibile e privo di vincoli grafici. Adatta spaziature, allineamento e contenuti tramite props in qualsiasi contesto.",
  primaryCtaLabel: "Esplora sezione",
  secondaryCtaLabel: "Leggi note",
  showSecondaryCta: true,
  layout: "split-right",
  surface: "light",
  imageUrl: "/src/assets/images/abstract_architectural_light_1794593557682.jpg",
  imageAlt: "Geometria architettonica minimalista alla luce naturale",
  accentColor: "#2563eb"
};

export default function HeroSection(props: HeroSectionProps) {
  const {
    eyebrow = DEFAULT_PROPS.eyebrow,
    title = DEFAULT_PROPS.title,
    description = DEFAULT_PROPS.description,
    primaryCtaLabel = DEFAULT_PROPS.primaryCtaLabel,
    secondaryCtaLabel = DEFAULT_PROPS.secondaryCtaLabel,
    showSecondaryCta = DEFAULT_PROPS.showSecondaryCta,
    layout = DEFAULT_PROPS.layout,
    surface = DEFAULT_PROPS.surface,
    imageUrl = DEFAULT_PROPS.imageUrl,
    imageAlt = DEFAULT_PROPS.imageAlt,
    accentColor = DEFAULT_PROPS.accentColor,
    onPrimaryClick,
    onSecondaryClick,
    className = '',
    children,
  } = props;

  const [imgError, setImgError] = useState(false);

  const isDark = surface === 'dark';
  const containerTheme =
    surface === 'dark'
      ? 'bg-slate-900 text-slate-50'
      : surface === 'muted'
      ? 'bg-slate-100 text-slate-900'
      : 'bg-white text-slate-900';

  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const secondaryBtn = isDark
    ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
    : 'border-slate-300 text-slate-700 hover:bg-slate-50';

  const mediaElement = (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-200 min-h-[260px] lg:min-h-[360px] w-full">
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={imageAlt || title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full min-h-[260px] items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 p-8">
          <div className="text-center">
            <svg className="mx-auto mb-2 opacity-60" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-xs font-medium">{imageAlt || 'Contenuto visivo'}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className={\`w-full py-14 md:py-20 px-6 \${containerTheme} \${className}\`}>
      <div className="mx-auto max-w-6xl">
        {layout === 'centered' ? (
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow && (
              <p
                style={{ color: accentColor }}
                className="mb-3 text-sm font-semibold tracking-wide"
              >
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance">
              {title}
            </h1>
            {description && (
              <p className={\`mt-5 text-base sm:text-lg leading-relaxed \${mutedText}\`}>
                {description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {primaryCtaLabel && (
                <button
                  type="button"
                  onClick={onPrimaryClick}
                  style={{ backgroundColor: accentColor }}
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
                >
                  {primaryCtaLabel}
                </button>
              )}
              {showSecondaryCta && secondaryCtaLabel && (
                <button
                  type="button"
                  onClick={onSecondaryClick}
                  className={\`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer \${secondaryBtn}\`}
                >
                  {secondaryCtaLabel}
                </button>
              )}
            </div>
            {children && <div className="mt-8">{children}</div>}
            {imageUrl && <div className="mt-10">{mediaElement}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div
              className={\`lg:col-span-6 flex flex-col justify-center \${
                layout === 'split-left' ? 'lg:order-2' : 'lg:order-1'
              }\`}
            >
              {eyebrow && (
                <p
                  style={{ color: accentColor }}
                  className="mb-3 text-sm font-semibold tracking-wide"
                >
                  {eyebrow}
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.14] text-balance">
                {title}
              </h1>
              {description && (
                <p className={\`mt-4 text-base leading-relaxed max-w-xl \${mutedText}\`}>
                  {description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {primaryCtaLabel && (
                  <button
                    type="button"
                    onClick={onPrimaryClick}
                    style={{ backgroundColor: accentColor }}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
                  >
                    {primaryCtaLabel}
                  </button>
                )}
                {showSecondaryCta && secondaryCtaLabel && (
                  <button
                    type="button"
                    onClick={onSecondaryClick}
                    className={\`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer \${secondaryBtn}\`}
                  >
                    {secondaryCtaLabel}
                  </button>
                )}
              </div>
              {children && <div className="mt-6">{children}</div>}
            </div>

            <div
              className={\`lg:col-span-6 flex \${
                layout === 'split-left' ? 'lg:order-1' : 'lg:order-2'
              }\`}
            >
              {mediaElement}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
`;

export const MENU_TEMPLATE = `import React, { useState } from 'react';

export interface MenuNode {
  id: string;
  label: string;
  description?: string;
  children?: { id: string; label: string }[];
}

export interface NavigationMenuProps {
  title?: string;
  items?: MenuNode[];
  orientation?: 'vertical' | 'horizontal';
  variant?: 'subtle' | 'bordered' | 'underline';
  collapsible?: boolean;
  defaultActiveId?: string;
  accentColor?: string;
  onSelect?: (id: string, label: string) => void;
  className?: string;
}

export const DEFAULT_PROPS: NavigationMenuProps = {
  title: "Indice della sezione",
  items: [
    {
      id: "introduzione",
      label: "Introduzione",
      description: "Principi base e struttura"
    },
    {
      id: "capitoli",
      label: "Capitoli principali",
      description: "Contenuti organizzati per tema",
      children: [
        { id: "cap-1", label: "Capitolo 01 · Fondamenti" },
        { id: "cap-2", label: "Capitolo 02 · Composizione" },
        { id: "cap-3", label: "Capitolo 03 · Estensione" }
      ]
    },
    {
      id: "appendice",
      label: "Appendice tecnica",
      description: "Riferimenti e parametri"
    },
    {
      id: "archivio",
      label: "Archivio note"
    }
  ],
  orientation: "vertical",
  variant: "bordered",
  collapsible: true,
  defaultActiveId: "introduzione",
  accentColor: "#2563eb"
};

export default function NavigationMenu(props: NavigationMenuProps) {
  const {
    title = DEFAULT_PROPS.title,
    items = DEFAULT_PROPS.items ?? [],
    orientation = DEFAULT_PROPS.orientation,
    variant = DEFAULT_PROPS.variant,
    collapsible = DEFAULT_PROPS.collapsible,
    defaultActiveId = DEFAULT_PROPS.defaultActiveId,
    accentColor = DEFAULT_PROPS.accentColor,
    onSelect,
    className = '',
  } = props;

  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id || '');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    capitoli: true,
  });

  const handleItemClick = (id: string, label: string, hasChildren?: boolean) => {
    if (hasChildren && collapsible) {
      setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    }
    setActiveId(id);
    onSelect?.(id, label);
  };

  if (orientation === 'horizontal') {
    return (
      <nav
        aria-label={title || 'Menù di navigazione'}
        className={\`w-full rounded-xl bg-white p-2 \${
          variant === 'bordered' ? 'border border-slate-200' : ''
        } \${className}\`}
      >
        <div className="flex flex-wrap items-center gap-1">
          {items.map((item) => {
            const isActive =
              activeId === item.id ||
              item.children?.some((child) => child.id === activeId);
            const isOpen = !!openGroups[item.id];
            const hasChildren = !!(item.children && item.children.length > 0);

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleItemClick(item.id, item.label, hasChildren)}
                  style={
                    isActive
                      ? variant === 'underline'
                        ? { color: accentColor, borderBottomColor: accentColor }
                        : { color: accentColor, backgroundColor: '#f1f5f9' }
                      : undefined
                  }
                  className={\`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer \${
                    variant === 'underline'
                      ? 'rounded-none border-b-2 border-transparent'
                      : ''
                  } \${!isActive ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : ''}\`}
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={\`transition-transform duration-150 \${
                        isOpen ? 'rotate-180' : ''
                      }\`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>

                {hasChildren && isOpen && (
                  <div className="mt-1.5 md:absolute md:left-0 md:top-full z-20 min-w-[220px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    {item.children!.map((child) => {
                      const childActive = activeId === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => {
                            setActiveId(child.id);
                            onSelect?.(child.id, child.label);
                            setOpenGroups((prev) => ({ ...prev, [item.id]: false }));
                          }}
                          style={childActive ? { color: accentColor } : undefined}
                          className={\`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer \${
                            childActive
                              ? 'bg-slate-100 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }\`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <aside
      aria-label={title || 'Menù laterale'}
      className={\`w-full max-w-xs rounded-xl bg-white p-4 \${
        variant === 'bordered'
          ? 'border border-slate-200'
          : variant === 'subtle'
          ? 'bg-slate-50/80'
          : ''
      } \${className}\`}
    >
      {title && (
        <div className="mb-3 px-2 text-xs font-semibold tracking-wide text-slate-500">
          {title}
        </div>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const hasChildren = !!(item.children && item.children.length > 0);
          const isOpen = !!openGroups[item.id];

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleItemClick(item.id, item.label, hasChildren)}
                style={
                  isActive
                    ? { color: accentColor, backgroundColor: '#f8fafc' }
                    : undefined
                }
                className={\`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors cursor-pointer \${
                  isActive
                    ? 'font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }\`}
              >
                <div className="min-w-0">
                  <div className="text-sm truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
                {hasChildren && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={\`shrink-0 ml-2 text-slate-400 transition-transform duration-150 \${
                      isOpen ? 'rotate-180' : ''
                    }\`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
              </button>

              {hasChildren && isOpen && (
                <ul className="mt-1 ml-3 space-y-1 border-l border-slate-200 pl-3">
                  {item.children!.map((child) => {
                    const childActive = activeId === child.id;
                    return (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(child.id);
                            onSelect?.(child.id, child.label);
                          }}
                          style={childActive ? { color: accentColor } : undefined}
                          className={\`w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer \${
                            childActive
                              ? 'bg-slate-100 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }\`}
                        >
                          {child.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
`;

export const FOOTER_TEMPLATE = `import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface SiteFooterProps {
  brandName?: string;
  summary?: string;
  columns?: FooterColumn[];
  bottomLinks?: FooterLink[];
  copyrightText?: string;
  variant?: 'columns' | 'minimal' | 'centered';
  surface?: 'light' | 'dark';
  accentColor?: string;
  onLinkClick?: (link: FooterLink) => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: SiteFooterProps = {
  brandName: "Atlante",
  summary: "Architettura di componenti neutri, estensibili e indipendenti per interfacce web contemporanee.",
  columns: [
    {
      heading: "Struttura",
      links: [
        { label: "Documentazione", href: "#docs" },
        { label: "Linee guida", href: "#guide" },
        { label: "Tipografia", href: "#tipo" }
      ]
    },
    {
      heading: "Risorse",
      links: [
        { label: "Archivio modelli", href: "#archivio" },
        { label: "Note di rilascio", href: "#note" },
        { label: "Accessibilità", href: "#a11y" }
      ]
    },
    {
      heading: "Progetto",
      links: [
        { label: "Informazioni", href: "#info" },
        { label: "Contatti", href: "#contatti" },
        { label: "Licenza aperta", href: "#licenza" }
      ]
    }
  ],
  bottomLinks: [
    { label: "Privacy", href: "#privacy" },
    { label: "Termini", href: "#termini" },
    { label: "Mappa sito", href: "#mappa" }
  ],
  copyrightText: "© 2026 Atlante. Tutti i diritti riservati.",
  variant: "columns",
  surface: "light",
  accentColor: "#2563eb"
};

export default function SiteFooter(props: SiteFooterProps) {
  const {
    brandName = DEFAULT_PROPS.brandName,
    summary = DEFAULT_PROPS.summary,
    columns = DEFAULT_PROPS.columns ?? [],
    bottomLinks = DEFAULT_PROPS.bottomLinks ?? [],
    copyrightText = DEFAULT_PROPS.copyrightText,
    variant = DEFAULT_PROPS.variant,
    surface = DEFAULT_PROPS.surface,
    accentColor = DEFAULT_PROPS.accentColor,
    onLinkClick,
    className = '',
    children,
  } = props;

  const isDark = surface === 'dark';
  const wrapperStyle = isDark
    ? 'bg-slate-900 text-slate-200 border-t border-slate-800'
    : 'bg-white text-slate-800 border-t border-slate-200';
  const mutedStyle = isDark ? 'text-slate-400' : 'text-slate-500';
  const headingStyle = isDark ? 'text-slate-100' : 'text-slate-900';
  const linkHover = isDark ? 'hover:text-white' : 'hover:text-slate-900';
  const dividerStyle = isDark ? 'border-slate-800' : 'border-slate-200';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link);
    } else if (link.href.startsWith('#')) {
      e.preventDefault();
    }
  };

  if (variant === 'minimal') {
    return (
      <footer className={\`w-full px-6 py-8 \${wrapperStyle} \${className}\`}>
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className={\`text-base font-semibold tracking-tight \${headingStyle}\`}>
              {brandName}
            </span>
            <span className={\`text-xs \${mutedStyle}\`}>{copyrightText}</span>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            {bottomLinks.map((link, idx) => (
              <a
                key={\`\${link.label}-\${idx}\`}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className={\`text-xs font-medium transition-colors \${mutedStyle} \${linkHover}\`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  if (variant === 'centered') {
    return (
      <footer className={\`w-full px-6 py-12 text-center \${wrapperStyle} \${className}\`}>
        <div className="mx-auto max-w-2xl">
          <div
            style={{ color: accentColor }}
            className="text-lg font-bold tracking-tight"
          >
            {brandName}
          </div>
          {summary && (
            <p className={\`mt-3 text-sm leading-relaxed \${mutedStyle}\`}>
              {summary}
            </p>
          )}
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-6">
            {columns.flatMap((c) => c.links).slice(0, 6).map((link, idx) => (
              <a
                key={\`\${link.label}-\${idx}\`}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className={\`text-sm font-medium transition-colors \${mutedStyle} \${linkHover}\`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {children && <div className="mt-6">{children}</div>}
          <div className={\`mt-8 border-t pt-6 text-xs \${dividerStyle} \${mutedStyle}\`}>
            {copyrightText}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={\`w-full px-6 py-12 \${wrapperStyle} \${className}\`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className={\`text-lg font-semibold tracking-tight \${headingStyle}\`}>
              {brandName}
            </div>
            {summary && (
              <p className={\`mt-3 text-sm leading-relaxed max-w-xs \${mutedStyle}\`}>
                {summary}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col, colIdx) => (
              <div key={\`\${col.heading}-\${colIdx}\`}>
                <h3 className={\`text-xs font-semibold tracking-wide \${headingStyle}\`}>
                  {col.heading}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((link, linkIdx) => (
                    <li key={\`\${link.label}-\${linkIdx}\`}>
                      <a
                        href={link.href}
                        onClick={(e) => handleClick(e, link)}
                        className={\`text-sm transition-colors \${mutedStyle} \${linkHover}\`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className={\`mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 \${dividerStyle}\`}
        >
          <p className={\`text-xs \${mutedStyle}\`}>{copyrightText}</p>
          <div className="flex flex-wrap items-center gap-5">
            {bottomLinks.map((link, idx) => (
              <a
                key={\`bottom-\${link.label}-\${idx}\`}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className={\`text-xs transition-colors \${mutedStyle} \${linkHover}\`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
`;
