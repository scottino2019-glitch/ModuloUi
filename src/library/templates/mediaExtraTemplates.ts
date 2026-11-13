export const GALLERY_TEMPLATE = `import React, { useState } from 'react';

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption?: string;
}

export interface ImageGalleryCardProps {
  title?: string;
  photos?: GalleryPhoto[];
  showThumbnails?: boolean;
  showCaptions?: boolean;
  aspectRatio?: '16/9' | '4/3' | '1/1';
  accentColor?: string;
  className?: string;
}

export const DEFAULT_PROPS: ImageGalleryCardProps = {
  title: "Raccolta fotografica",
  photos: [
    {
      id: "foto-1",
      src: "/src/assets/images/abstract_architectural_light_1794593557682.jpg",
      title: "Volumi in luce diurna",
      caption: "Studio di geometria architettonica e ombre nette"
    },
    {
      id: "foto-2",
      src: "/src/assets/images/abstract_architectural_dusk_1794594109798.jpg",
      title: "Struttura al crepuscolo",
      caption: "Contrasto tra cemento freddo e luce interna calda"
    },
    {
      id: "foto-3",
      src: "/src/assets/images/minimal_studio_landscape_1794593556848.jpg",
      title: "Orizzonte alpino",
      caption: "Profilo montano immerso nella foschia dell'alba"
    },
    {
      id: "foto-4",
      src: "/src/assets/images/geometric_sound_cover_1794593556961.jpg",
      title: "Cerchi concentrici",
      caption: "Composizione grafica modulare su carta ruvida"
    }
  ],
  showThumbnails: true,
  showCaptions: true,
  aspectRatio: "16/9",
  accentColor: "#2563eb"
};

export default function ImageGalleryCard(props: ImageGalleryCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    photos = DEFAULT_PROPS.photos ?? [],
    showThumbnails = DEFAULT_PROPS.showThumbnails,
    showCaptions = DEFAULT_PROPS.showCaptions,
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    accentColor = DEFAULT_PROPS.accentColor,
    className = '',
  } = props;

  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!photos.length) return null;

  const current = photos[activeIdx] || photos[0];
  const ratioClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : 'aspect-video';

  const prev = () => setActiveIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActiveIdx((i) => (i + 1) % photos.length);

  return (
    <div className={\`w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${className}\`}>
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <span className="font-mono text-xs tabular-nums text-slate-500">
          {activeIdx + 1} / {photos.length}
        </span>
      </div>

      <div className={\`relative overflow-hidden rounded-xl bg-slate-100 \${ratioClass}\`}>
        <img
          src={current.src}
          alt={current.title}
          referrerPolicy="no-referrer"
          onClick={() => setZoomed((z) => !z)}
          className={\`h-full w-full object-cover transition-transform duration-300 cursor-zoom-in \${
            zoomed ? 'scale-110 cursor-zoom-out' : 'scale-100'
          }\`}
        />

        <button
          type="button"
          onClick={prev}
          aria-label="Immagine precedente"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm hover:bg-white cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Immagine successiva"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm hover:bg-white cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {showCaptions && (
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">{current.title}</p>
          {current.caption && (
            <p className="text-xs text-slate-500">{current.caption}</p>
          )}
        </div>
      )}

      {showThumbnails && photos.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {photos.map((photo, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  setActiveIdx(idx);
                  setZoomed(false);
                }}
                style={isSelected ? { borderColor: accentColor } : undefined}
                className={\`overflow-hidden rounded-lg border-2 aspect-[4/3] transition-opacity cursor-pointer \${
                  isSelected ? 'opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
                }\`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
`;

export const BEFORE_AFTER_TEMPLATE = `import React, { useRef, useState } from 'react';

export interface BeforeAfterSliderProps {
  title?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  accentColor?: string;
  className?: string;
}

export const DEFAULT_PROPS: BeforeAfterSliderProps = {
  title: "Confronto visivo luce diurna / crepuscolo",
  beforeImageUrl: "/src/assets/images/abstract_architectural_light_1794593557682.jpg",
  afterImageUrl: "/src/assets/images/abstract_architectural_dusk_1794594109798.jpg",
  beforeLabel: "Giorno",
  afterLabel: "Crepuscolo",
  initialPosition: 50,
  accentColor: "#2563eb"
};

export default function BeforeAfterSlider(props: BeforeAfterSliderProps) {
  const {
    title = DEFAULT_PROPS.title,
    beforeImageUrl = DEFAULT_PROPS.beforeImageUrl,
    afterImageUrl = DEFAULT_PROPS.afterImageUrl,
    beforeLabel = DEFAULT_PROPS.beforeLabel,
    afterLabel = DEFAULT_PROPS.afterLabel,
    initialPosition = DEFAULT_PROPS.initialPosition ?? 50,
    accentColor = DEFAULT_PROPS.accentColor,
    className = '',
  } = props;

  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, Math.round(pct))));
  };

  return (
    <div className={\`w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${className}\`}>
      {title && (
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <span className="font-mono text-xs tabular-nums text-slate-500">
            {position}%
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        onPointerDown={(e) => {
          updateFromClientX(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) updateFromClientX(e.clientX);
        }}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 select-none touch-none cursor-ew-resize"
      >
        <img
          src={afterImageUrl}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />

        <div
          style={{ clipPath: \`inset(0 \${100 - position}% 0 0)\` }}
          className="absolute inset-0"
        >
          <img
            src={beforeImageUrl}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Labels */}
        {beforeLabel && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-slate-950/75 px-2.5 py-1 text-xs font-medium text-white">
            {beforeLabel}
          </span>
        )}
        {afterLabel && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-slate-950/75 px-2.5 py-1 text-xs font-medium text-white">
            {afterLabel}
          </span>
        )}

        {/* Divider line & handle */}
        <div
          style={{ left: \`\${position}%\` }}
          className="pointer-events-none absolute top-0 bottom-0 -translate-x-1/2 w-0.5 bg-white shadow"
        >
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m9 18-6-6 6-6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-500 shrink-0">{beforeLabel}</span>
        <input
          type="range"
          aria-label="Posizione confronto"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          style={{ accentColor }}
          className="w-full h-1.5 cursor-pointer"
        />
        <span className="text-xs text-slate-500 shrink-0">{afterLabel}</span>
      </div>
    </div>
  );
}
`;

export const CAROUSEL_TEMPLATE = `import React, { useEffect, useState } from 'react';

export interface CarouselSlide {
  id: string;
  kicker?: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CarouselDeckProps {
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  accentColor?: string;
  onSlideChange?: (index: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: CarouselDeckProps = {
  slides: [
    {
      id: "s1",
      kicker: "Scheda 01",
      title: "Architettura modulare riutilizzabile",
      description: "Componenti indipendenti progettati per adattarsi a qualsiasi schema cromatico e gerarchia editoriale.",
      imageUrl: "/src/assets/images/abstract_architectural_light_1794593557682.jpg"
    },
    {
      id: "s2",
      kicker: "Scheda 02",
      title: "Equilibrio tra testo e superficie",
      description: "Proporzioni calibrate per garantire leggibilità costante su desktop, tablet e dispositivi mobili.",
      imageUrl: "/src/assets/images/minimal_studio_landscape_1794593556848.jpg"
    },
    {
      id: "s3",
      kicker: "Scheda 03",
      title: "Contrasto notturno e definizione",
      description: "Struttura solida con supporto immediato a varianti di sfondo chiare o scure.",
      imageUrl: "/src/assets/images/abstract_architectural_dusk_1794594109798.jpg"
    }
  ],
  autoPlay: false,
  intervalMs: 4000,
  showDots: true,
  accentColor: "#2563eb"
};

export default function CarouselDeck(props: CarouselDeckProps) {
  const {
    slides = DEFAULT_PROPS.slides ?? [],
    autoPlay = DEFAULT_PROPS.autoPlay,
    intervalMs = DEFAULT_PROPS.intervalMs ?? 4000,
    showDots = DEFAULT_PROPS.showDots,
    accentColor = DEFAULT_PROPS.accentColor,
    onSlideChange,
    className = '',
  } = props;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        onSlideChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, slides.length, onSlideChange]);

  if (!slides.length) return null;

  const goTo = (nextIdx: number) => {
    const safe = (nextIdx + slides.length) % slides.length;
    setIndex(safe);
    onSlideChange?.(safe);
  };

  const active = slides[index] || slides[0];

  return (
    <div className={\`w-full max-w-2xl rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm \${className}\`}>
      {active.imageUrl && (
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={active.imageUrl}
            alt={active.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-opacity duration-200"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {active.kicker && (
              <p style={{ color: accentColor }} className="text-xs font-semibold tracking-wide">
                {active.kicker}
              </p>
            )}
            <h3 className="mt-1 text-xl font-semibold text-slate-900 text-balance">
              {active.title}
            </h3>
          </div>
          <span className="font-mono text-xs tabular-nums text-slate-400 shrink-0">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          {active.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Scheda precedente"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Precedente
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Scheda successiva"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Successiva
            </button>
          </div>

          {showDots && (
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={\`Vai alla scheda \${idx + 1}\`}
                  onClick={() => goTo(idx)}
                  style={idx === index ? { backgroundColor: accentColor } : undefined}
                  className={\`h-2 rounded-full transition-all cursor-pointer \${
                    idx === index ? 'w-5' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }\`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
