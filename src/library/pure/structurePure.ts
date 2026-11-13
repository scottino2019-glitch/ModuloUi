export const HEADER_PURE = {
  tsx: `import React, { useState } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  brandName?: string;
  links?: NavItem[];
  actionLabel?: string;
  onAction?: () => void;
  onNavigate?: (item: NavItem) => void;
  className?: string;
}

export default function SiteHeader({
  brandName = 'Atlante',
  links = [
    { label: 'Panoramica', href: '#panoramica' },
    { label: 'Archivio', href: '#archivio' },
    { label: 'Documenti', href: '#documenti' },
    { label: 'Risorse', href: '#risorse' },
  ],
  actionLabel = 'Inizia ora',
  onAction,
  onNavigate,
  className = '',
}: SiteHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, item: NavItem, index: number) => {
    e.preventDefault();
    setActiveIndex(index);
    setMenuOpen(false);
    onNavigate?.(item);
  };

  return (
    <header className={\`mui-header \${className}\`}>
      <div className="mui-header-inner">
        <a
          href="#top"
          onClick={(e) => e.preventDefault()}
          className="mui-header-brand"
        >
          {brandName}
        </a>

        <nav className="mui-header-nav" aria-label="Navigazione principale">
          {links.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item, idx)}
              className={\`mui-header-link \${idx === activeIndex ? 'is-active' : ''}\`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mui-header-actions">
          {actionLabel && (
            <button type="button" onClick={onAction} className="mui-header-btn">
              {actionLabel}
            </button>
          )}
          <button
            type="button"
            className="mui-header-toggle"
            aria-label="Apri menù"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mui-header-mobile">
          {links.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item, idx)}
              className={\`mui-header-mobile-link \${idx === activeIndex ? 'is-active' : ''}\`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
`,
  css: `.mui-header {
  width: 100%;
  background-color: #ffffff;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-header-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.mui-header-brand {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  white-space: nowrap;
}

.mui-header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mui-header-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
  white-space: nowrap;
}

.mui-header-link:hover {
  color: #0f172a;
}

.mui-header-link.is-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.mui-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mui-header-btn {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.mui-header-btn:hover {
  background-color: #1d4ed8;
}

.mui-header-toggle {
  display: none;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 1rem;
  color: #0f172a;
  cursor: pointer;
}

.mui-header-mobile {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 12px 24px 16px;
  border-top: 1px solid #e2e8f0;
}

.mui-header-mobile-link {
  font-size: 0.95rem;
  color: #334155;
  text-decoration: none;
  padding: 6px 0;
}

.mui-header-mobile-link.is-active {
  color: #2563eb;
  font-weight: 600;
}

@media (max-width: 720px) {
  .mui-header-nav,
  .mui-header-btn {
    display: none;
  }
  .mui-header-toggle {
    display: inline-flex;
  }
  .mui-header-mobile {
    display: flex;
  }
}
`,
};

export const HERO_PURE = {
  tsx: `import React from 'react';

export interface HeroSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  imageUrl?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export default function HeroSection({
  eyebrow = 'Sistema modulare',
  title = 'Strutture essenziali per progetti editoriali e digitali',
  description = 'Un punto di partenza pulito, flessibile e privo di vincoli grafici. Modifica liberamente testi, colori, layout e foglio di stile.',
  primaryLabel = 'Esplora sezione',
  secondaryLabel = 'Leggi note',
  imageUrl = '/src/assets/images/abstract_architectural_light_1794593557682.jpg',
  onPrimaryClick,
  onSecondaryClick,
  className = '',
}: HeroSectionProps) {
  return (
    <section className={\`mui-hero \${className}\`}>
      <div className="mui-hero-grid">
        <div className="mui-hero-content">
          {eyebrow && <p className="mui-hero-eyebrow">{eyebrow}</p>}
          <h1 className="mui-hero-title">{title}</h1>
          {description && <p className="mui-hero-desc">{description}</p>}

          <div className="mui-hero-actions">
            {primaryLabel && (
              <button type="button" onClick={onPrimaryClick} className="mui-hero-btn-primary">
                {primaryLabel}
              </button>
            )}
            {secondaryLabel && (
              <button type="button" onClick={onSecondaryClick} className="mui-hero-btn-secondary">
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>

        <div className="mui-hero-media">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="mui-hero-img"
          />
        </div>
      </div>
    </section>
  );
}
`,
  css: `.mui-hero {
  width: 100%;
  background-color: #ffffff;
  color: #0f172a;
  padding: 48px 24px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-hero-grid {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.mui-hero-eyebrow {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 12px;
}

.mui-hero-title {
  font-size: clamp(1.8rem, 3vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
  color: #0f172a;
}

.mui-hero-desc {
  margin: 18px 0 0;
  font-size: 1rem;
  line-height: 1.65;
  color: #475569;
}

.mui-hero-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mui-hero-btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 11px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-hero-btn-primary:hover {
  background-color: #1d4ed8;
}

.mui-hero-btn-secondary {
  background-color: transparent;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-hero-btn-secondary:hover {
  background-color: #f8fafc;
}

.mui-hero-media {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  aspect-ratio: 16 / 10;
  background-color: #f1f5f9;
}

.mui-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .mui-hero-grid {
    grid-template-columns: 1fr;
  }
}
`,
};

export const MENU_PURE = {
  tsx: `import React, { useState } from 'react';

export interface MenuEntry {
  id: string;
  label: string;
  description?: string;
  children?: { id: string; label: string }[];
}

export interface NavigationMenuProps {
  title?: string;
  items?: MenuEntry[];
  onSelect?: (id: string, label: string) => void;
  className?: string;
}

export default function NavigationMenu({
  title = 'Indice della sezione',
  items = [
    { id: 'intro', label: 'Introduzione', description: 'Principi base e struttura' },
    {
      id: 'capitoli',
      label: 'Capitoli principali',
      description: 'Contenuti organizzati per tema',
      children: [
        { id: 'cap-1', label: 'Capitolo 01 · Fondamenti' },
        { id: 'cap-2', label: 'Capitolo 02 · Composizione' },
        { id: 'cap-3', label: 'Capitolo 03 · Estensione' },
      ],
    },
    { id: 'appendice', label: 'Appendice tecnica', description: 'Riferimenti e parametri' },
    { id: 'archivio', label: 'Archivio note' },
  ],
  onSelect,
  className = '',
}: NavigationMenuProps) {
  const [activeId, setActiveId] = useState('intro');
  const [openId, setOpenId] = useState<string | null>('capitoli');

  const handleSelect = (id: string, label: string, hasChildren?: boolean) => {
    if (hasChildren) {
      setOpenId((prev) => (prev === id ? null : id));
    }
    setActiveId(id);
    onSelect?.(id, label);
  };

  return (
    <aside className={\`mui-menu \${className}\`} aria-label={title}>
      {title && <div className="mui-menu-title">{title}</div>}

      <ul className="mui-menu-list">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const hasChildren = Boolean(item.children?.length);
          const isOpen = openId === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item.id, item.label, hasChildren)}
                className={\`mui-menu-item \${isActive ? 'is-active' : ''}\`}
              >
                <div>
                  <div className="mui-menu-label">{item.label}</div>
                  {item.description && (
                    <div className="mui-menu-desc">{item.description}</div>
                  )}
                </div>
                {hasChildren && (
                  <span className={\`mui-menu-arrow \${isOpen ? 'is-open' : ''}\`}>▾</span>
                )}
              </button>

              {hasChildren && isOpen && (
                <ul className="mui-menu-sub">
                  {item.children!.map((child) => (
                    <li key={child.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(child.id, child.label)}
                        className={\`mui-menu-sub-item \${activeId === child.id ? 'is-active' : ''}\`}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
`,
  css: `.mui-menu {
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-menu-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 10px;
  padding: 0 8px;
}

.mui-menu-list,
.mui-menu-sub {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mui-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: #1e293b;
}

.mui-menu-item:hover {
  background-color: #f8fafc;
}

.mui-menu-item.is-active {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.mui-menu-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.mui-menu-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.mui-menu-arrow {
  font-size: 0.85rem;
  color: #64748b;
  transition: transform 0.15s ease;
}

.mui-menu-arrow.is-open {
  transform: rotate(180deg);
}

.mui-menu-sub {
  margin-left: 14px;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 1px solid #e2e8f0;
}

.mui-menu-sub-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 0.82rem;
  color: #475569;
  cursor: pointer;
}

.mui-menu-sub-item:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.mui-menu-sub-item.is-active {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}
`,
};

export const FOOTER_PURE = {
  tsx: `import React from 'react';

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface SiteFooterProps {
  brandName?: string;
  summary?: string;
  columns?: FooterColumn[];
  copyright?: string;
  className?: string;
}

export default function SiteFooter({
  brandName = 'Atlante',
  summary = 'Architettura di componenti neutri, estensibili e indipendenti per interfacce web contemporanee.',
  columns = [
    {
      heading: 'Struttura',
      links: [
        { label: 'Documentazione', href: '#docs' },
        { label: 'Linee guida', href: '#guide' },
        { label: 'Tipografia', href: '#tipo' },
      ],
    },
    {
      heading: 'Risorse',
      links: [
        { label: 'Archivio modelli', href: '#archivio' },
        { label: 'Note di rilascio', href: '#note' },
        { label: 'Accessibilità', href: '#a11y' },
      ],
    },
    {
      heading: 'Progetto',
      links: [
        { label: 'Informazioni', href: '#info' },
        { label: 'Contatti', href: '#contatti' },
        { label: 'Licenza aperta', href: '#licenza' },
      ],
    },
  ],
  copyright = '© 2026 Atlante. Tutti i diritti riservati.',
  className = '',
}: SiteFooterProps) {
  return (
    <footer className={\`mui-footer \${className}\`}>
      <div className="mui-footer-inner">
        <div className="mui-footer-top">
          <div className="mui-footer-brand-col">
            <div className="mui-footer-brand">{brandName}</div>
            <p className="mui-footer-summary">{summary}</p>
          </div>

          <div className="mui-footer-cols">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="mui-footer-heading">{col.heading}</h3>
                <ul className="mui-footer-links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => e.preventDefault()}
                        className="mui-footer-link"
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

        <div className="mui-footer-bottom">
          <span>{copyright}</span>
          <div className="mui-footer-legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#termini" onClick={(e) => e.preventDefault()}>Termini</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
`,
  css: `.mui-footer {
  width: 100%;
  background-color: #ffffff;
  color: #334155;
  border-top: 1px solid #e2e8f0;
  padding: 44px 24px 28px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-footer-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.mui-footer-top {
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 40px;
}

.mui-footer-brand {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-footer-summary {
  margin-top: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #64748b;
  max-width: 280px;
}

.mui-footer-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.mui-footer-heading {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.mui-footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mui-footer-link {
  font-size: 0.9rem;
  color: #475569;
  text-decoration: none;
}

.mui-footer-link:hover {
  color: #0f172a;
}

.mui-footer-bottom {
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-footer-legal {
  display: flex;
  gap: 20px;
}

.mui-footer-legal a {
  color: #64748b;
  text-decoration: none;
}

.mui-footer-legal a:hover {
  color: #0f172a;
}

@media (max-width: 768px) {
  .mui-footer-top {
    grid-template-columns: 1fr;
  }
  .mui-footer-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}
`,
};

export const BREADCRUMBS_PURE = {
  tsx: `import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbTrailProps {
  items?: BreadcrumbItem[];
  separator?: string;
  onSelect?: (item: BreadcrumbItem, index: number) => void;
  className?: string;
}

export default function BreadcrumbTrail({
  items = [
    { label: 'Archivio', href: '#archivio' },
    { label: 'Documentazione', href: '#docs' },
    { label: 'Componenti base', href: '#base' },
    { label: 'Navigazione gerarchica' },
  ],
  separator = '/',
  onSelect,
  className = '',
}: BreadcrumbTrailProps) {
  return (
    <nav aria-label="Percorso di navigazione" className={\`mui-breadcrumbs \${className}\`}>
      <ol className="mui-breadcrumbs-list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item.label}>
              <li>
                {isLast ? (
                  <span className="mui-breadcrumbs-current">{item.label}</span>
                ) : (
                  <a
                    href={item.href || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect?.(item, idx);
                    }}
                    className="mui-breadcrumbs-link"
                  >
                    {item.label}
                  </a>
                )}
              </li>
              {!isLast && (
                <li className="mui-breadcrumbs-sep" aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
`,
  css: `.mui-breadcrumbs {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 18px;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-breadcrumbs-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.mui-breadcrumbs-link {
  color: #475569;
  text-decoration: none;
}

.mui-breadcrumbs-link:hover {
  color: #0f172a;
  text-decoration: underline;
}

.mui-breadcrumbs-sep {
  color: #94a3b8;
  user-select: none;
}

.mui-breadcrumbs-current {
  color: #2563eb;
  font-weight: 600;
}
`,
};

export const SIDEBAR_PURE = {
  tsx: `import React, { useState } from 'react';

export interface SidebarSection {
  heading: string;
  items: { id: string; label: string; count?: string }[];
}

export interface SidebarDrawerProps {
  title?: string;
  sections?: SidebarSection[];
  onSelect?: (id: string) => void;
  className?: string;
}

export default function SidebarDrawer({
  title = 'Spazio di lavoro',
  sections = [
    {
      heading: 'Principali',
      items: [
        { id: 'riepilogo', label: 'Riepilogo', count: '12' },
        { id: 'raccolte', label: 'Raccolte', count: '4' },
        { id: 'note', label: 'Annotazioni' },
      ],
    },
    {
      heading: 'Strumenti',
      items: [
        { id: 'modelli', label: 'Modelli base' },
        { id: 'archivio', label: 'Archivio locale' },
        { id: 'preferenze', label: 'Preferenze' },
      ],
    },
  ],
  onSelect,
  className = '',
}: SidebarDrawerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState('riepilogo');

  return (
    <aside className={\`mui-sidebar \${collapsed ? 'is-collapsed' : ''} \${className}\`}>
      <div className="mui-sidebar-top">
        {!collapsed && <span className="mui-sidebar-title">{title}</span>}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="mui-sidebar-toggle"
          aria-label={collapsed ? 'Espandi' : 'Comprimi'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="mui-sidebar-body">
        {sections.map((section) => (
          <div key={section.heading} className="mui-sidebar-group">
            {!collapsed && (
              <div className="mui-sidebar-heading">{section.heading}</div>
            )}
            <ul className="mui-sidebar-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(item.id);
                      onSelect?.(item.id);
                    }}
                    className={\`mui-sidebar-item \${activeId === item.id ? 'is-active' : ''}\`}
                  >
                    <span className="mui-sidebar-dot" />
                    {!collapsed && <span className="mui-sidebar-label">{item.label}</span>}
                    {!collapsed && item.count && (
                      <span className="mui-sidebar-count">{item.count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
`,
  css: `.mui-sidebar {
  width: 260px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: width 0.2s ease;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-sidebar.is-collapsed {
  width: 68px;
}

.mui-sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.mui-sidebar-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-sidebar-toggle {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  color: #475569;
}

.mui-sidebar-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mui-sidebar-heading {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  padding: 0 8px 6px;
}

.mui-sidebar-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mui-sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #334155;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
}

.mui-sidebar-item:hover {
  background-color: #f8fafc;
}

.mui-sidebar-item.is-active {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.mui-sidebar-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: currentColor;
  flex-shrink: 0;
}

.mui-sidebar-label {
  flex: 1;
}

.mui-sidebar-count {
  font-size: 0.75rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}
`,
};
