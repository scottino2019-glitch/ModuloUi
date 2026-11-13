export const FLASHCARD_TEMPLATE = `import React, { useState } from 'react';

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  topic?: string;
}

export interface FlashcardDeckProps {
  title?: string;
  cards?: FlashcardItem[];
  allowShuffle?: boolean;
  accentColor?: string;
  onComplete?: (masteredCount: number, total: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: FlashcardDeckProps = {
  title: "Mazzo di studio",
  cards: [
    {
      id: "fc-1",
      topic: "Tipografia",
      front: "Cos'è la gerarchia tipografica?",
      back: "L'organizzazione di dimensioni, pesi e spaziature per guidare l'occhio attraverso i contenuti in ordine di importanza."
    },
    {
      id: "fc-2",
      topic: "Architettura React",
      front: "Quando usare uno stato locale rispetto alle props?",
      back: "Le props ricevono dati e callback dall'esterno; lo stato locale gestisce interazioni interne transitorie del componente."
    },
    {
      id: "fc-3",
      topic: "Accessibilità",
      front: "A cosa serve focus-visible?",
      back: "Mostra l'anello di messa a fuoco soltanto durante la navigazione da tastiera, evitando bordi superflui al clic del mouse."
    },
    {
      id: "fc-4",
      topic: "Layout",
      front: "Qual è il vantaggio di gap rispetto ai margini?",
      back: "Gestisce la distanza esclusivamente tra elementi adiacenti, evitando accumuli indesiderati sui bordi esterni del contenitore."
    }
  ],
  allowShuffle: true,
  accentColor: "#2563eb"
};

export default function FlashcardDeck(props: FlashcardDeckProps) {
  const {
    title = DEFAULT_PROPS.title,
    cards = DEFAULT_PROPS.cards ?? [],
    allowShuffle = DEFAULT_PROPS.allowShuffle,
    accentColor = DEFAULT_PROPS.accentColor,
    onComplete,
    className = '',
  } = props;

  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});

  if (!deck.length) return null;

  const current = deck[index] || deck[0];
  const masteredCount = Object.values(masteredIds).filter(Boolean).length;

  const handleShuffle = () => {
    const copy = [...deck];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setDeck(copy);
    setIndex(0);
    setFlipped(false);
  };

  const markCard = (known: boolean) => {
    const nextMap = { ...masteredIds, [current.id]: known };
    setMasteredIds(nextMap);
    const nextMastered = Object.values(nextMap).filter(Boolean).length;
    if (index < deck.length - 1) {
      setFlipped(false);
      setIndex(index + 1);
    } else {
      onComplete?.(nextMastered, deck.length);
      setFlipped(false);
      setIndex(0);
    }
  };

  return (
    <div className={\`w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm \${className}\`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
            Acquisite: {masteredCount} / {deck.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allowShuffle && (
            <button
              type="button"
              onClick={handleShuffle}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Mescola
            </button>
          )}
          <span className="font-mono text-xs tabular-nums text-slate-500">
            {index + 1}/{deck.length}
          </span>
        </div>
      </div>

      <div style={{ perspective: '1000px' }} className="mt-5">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative block min-h-[210px] w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 rounded-xl"
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{current.topic || 'Scheda'}</span>
              <span>Fronte · Clicca per girare</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 leading-snug text-center px-2">
              {current.front}
            </p>
            <div className="text-center text-xs text-slate-400">
              Tocca la scheda per visualizzare la risposta
            </div>
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderColor: accentColor,
            }}
            className="absolute inset-0 flex flex-col justify-between rounded-xl border-2 bg-white p-6"
          >
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: accentColor }} className="font-semibold">
                Risposta
              </span>
              <span className="text-slate-400">Retro</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed text-center px-2">
              {current.back}
            </p>
            <div className="text-center text-xs text-slate-400">
              Valuta la tua preparazione qui sotto
            </div>
          </div>
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => markCard(false)}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Da rivedere
        </button>
        <button
          type="button"
          onClick={() => markCard(true)}
          style={{ backgroundColor: accentColor }}
          className="flex-1 rounded-lg px-4 py-2 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
        >
          Acquisita
        </button>
      </div>
    </div>
  );
}
`;

export const FOCUS_TIMER_TEMPLATE = `import React, { useEffect, useState } from 'react';

export interface FocusTimerCardProps {
  title?: string;
  workMinutes?: number;
  breakMinutes?: number;
  autoSwitch?: boolean;
  accentColor?: string;
  onSessionComplete?: (mode: 'work' | 'break', completedCount: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: FocusTimerCardProps = {
  title: "Timer di concentrazione",
  workMinutes: 25,
  breakMinutes: 5,
  autoSwitch: true,
  accentColor: "#2563eb"
};

export default function FocusTimerCard(props: FocusTimerCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    workMinutes = DEFAULT_PROPS.workMinutes ?? 25,
    breakMinutes = DEFAULT_PROPS.breakMinutes ?? 5,
    autoSwitch = DEFAULT_PROPS.autoSwitch,
    accentColor = DEFAULT_PROPS.accentColor,
    onSessionComplete,
    className = '',
  } = props;

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const totalSeconds = (mode === 'work' ? workMinutes : breakMinutes) * 60;

  useEffect(() => {
    setRunning(false);
    setSecondsLeft((mode === 'work' ? workMinutes : breakMinutes) * 60);
  }, [workMinutes, breakMinutes, mode]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextSessions = mode === 'work' ? sessions + 1 : sessions;
          if (mode === 'work') setSessions(nextSessions);
          onSessionComplete?.(mode, nextSessions);

          if (autoSwitch) {
            const nextMode = mode === 'work' ? 'break' : 'work';
            setMode(nextMode);
            return (nextMode === 'work' ? workMinutes : breakMinutes) * 60;
          }
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, workMinutes, breakMinutes, autoSwitch, sessions, onSessionComplete]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pct = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className={\`w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm \${className}\`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="font-mono text-xs tabular-nums text-slate-500">
          Cicli: {sessions}
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('work')}
          className={\`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer \${
            mode === 'work' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }\`}
        >
          Lavoro ({workMinutes}m)
        </button>
        <button
          type="button"
          onClick={() => setMode('break')}
          className={\`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer \${
            mode === 'break' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }\`}
        >
          Pausa ({breakMinutes}m)
        </button>
      </div>

      {/* Progress Ring */}
      <div className="relative mx-auto my-6 flex h-36 w-36 items-center justify-center">
        <svg className="-rotate-90 h-36 w-36" viewBox="0 0 132 132">
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold tabular-nums text-slate-900">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            {mode === 'work' ? 'Sessione attiva' : 'Intervallo pausa'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          style={{ backgroundColor: accentColor }}
          className="rounded-lg px-5 py-2 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
        >
          {running ? 'Pausa' : 'Avvia'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(totalSeconds);
          }}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Azzera
        </button>
      </div>
    </div>
  );
}
`;

export const MINI_CALENDAR_TEMPLATE = `import React, { useState } from 'react';

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
}

export interface MiniCalendarCardProps {
  title?: string;
  initialEvents?: CalendarEvent[];
  allowAddEvent?: boolean;
  accentColor?: string;
  onSelectDate?: (isoDate: string) => void;
  className?: string;
}

export const DEFAULT_PROPS: MiniCalendarCardProps = {
  title: "Agenda mensile",
  initialEvents: [
    { date: "2026-11-13", label: "Revisione struttura moduli" },
    { date: "2026-11-18", label: "Consegna bozza documentazione" },
    { date: "2026-11-24", label: "Sessione di verifica accessibilità" }
  ],
  allowAddEvent: true,
  accentColor: "#2563eb"
};

const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export default function MiniCalendarCard(props: MiniCalendarCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    initialEvents = DEFAULT_PROPS.initialEvents ?? [],
    allowAddEvent = DEFAULT_PROPS.allowAddEvent,
    accentColor = DEFAULT_PROPS.accentColor,
    onSelectDate,
    className = '',
  } = props;

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 0-indexed -> Novembre
  const [selectedIso, setSelectedIso] = useState('2026-11-13');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [draftLabel, setDraftLabel] = useState('');

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const formatIso = (day: number) =>
    \`\${viewYear}-\${String(viewMonth + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;

  const selectedEvents = events.filter((e) => e.date === selectedIso);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draftLabel.trim();
    if (!text) return;
    setEvents([...events, { date: selectedIso, label: text }]);
    setDraftLabel('');
  };

  return (
    <div className={\`w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${className}\`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          {title && <p className="text-xs font-medium text-slate-500">{title}</p>}
          <h3 className="text-base font-semibold text-slate-900">
            {MONTHS_IT[viewMonth]} {viewYear}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Mese precedente"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Mese successivo"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {DAYS_IT.map((d) => (
          <div key={d} className="py-1 text-[11px] font-medium text-slate-400">
            {d}
          </div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={\`empty-\${i}\`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const iso = formatIso(day);
          const isSelected = iso === selectedIso;
          const hasEvent = events.some((ev) => ev.date === iso);

          return (
            <button
              key={iso}
              type="button"
              onClick={() => {
                setSelectedIso(iso);
                onSelectDate?.(iso);
              }}
              style={isSelected ? { backgroundColor: accentColor } : undefined}
              className={\`relative flex h-9 flex-col items-center justify-center rounded-lg text-xs font-mono tabular-nums transition-colors cursor-pointer \${
                isSelected
                  ? 'font-semibold text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }\`}
            >
              <span>{day}</span>
              {hasEvent && (
                <span
                  style={!isSelected ? { backgroundColor: accentColor } : undefined}
                  className={\`mt-0.5 h-1 w-1 rounded-full \${
                    isSelected ? 'bg-white' : ''
                  }\`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono tabular-nums">{selectedIso}</span>
          <span>{selectedEvents.length} eventi</span>
        </div>

        <ul className="mt-2 space-y-1.5">
          {selectedEvents.length === 0 ? (
            <li className="text-xs text-slate-400 py-1">Nessun appunto per questa data.</li>
          ) : (
            selectedEvents.map((ev, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-800"
              >
                <span>{ev.label}</span>
              </li>
            ))
          )}
        </ul>

        {allowAddEvent && (
          <form onSubmit={handleAddEvent} className="mt-3 flex gap-2">
            <input
              type="text"
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              placeholder="Aggiungi nota al giorno..."
              className="flex-1 min-w-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              style={{ backgroundColor: accentColor }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
            >
              Salva
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
`;

export const MINI_KANBAN_TEMPLATE = `import React, { useState } from 'react';

export interface KanbanCardItem {
  id: string;
  title: string;
  column: 'todo' | 'doing' | 'done';
}

export interface MiniKanbanCardProps {
  title?: string;
  initialCards?: KanbanCardItem[];
  allowAdd?: boolean;
  accentColor?: string;
  onCardsChange?: (cards: KanbanCardItem[]) => void;
  className?: string;
}

export const DEFAULT_PROPS: MiniKanbanCardProps = {
  title: "Bacheca attività",
  initialCards: [
    { id: "k1", title: "Definire schema props", column: "done" },
    { id: "k2", title: "Rifinire spaziatura mobile", column: "doing" },
    { id: "k3", title: "Scrivere note di utilizzo", column: "todo" },
    { id: "k4", title: "Verificare contrasto testi", column: "todo" }
  ],
  allowAdd: true,
  accentColor: "#2563eb"
};

const COLUMNS: { id: KanbanCardItem['column']; label: string }[] = [
  { id: 'todo', label: 'Da fare' },
  { id: 'doing', label: 'In corso' },
  { id: 'done', label: 'Completato' },
];

export default function MiniKanbanCard(props: MiniKanbanCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    initialCards = DEFAULT_PROPS.initialCards ?? [],
    allowAdd = DEFAULT_PROPS.allowAdd,
    accentColor = DEFAULT_PROPS.accentColor,
    onCardsChange,
    className = '',
  } = props;

  const [cards, setCards] = useState<KanbanCardItem[]>(initialCards);
  const [draft, setDraft] = useState('');

  const syncCards = (next: KanbanCardItem[]) => {
    setCards(next);
    onCardsChange?.(next);
  };

  const moveCard = (id: string, dir: -1 | 1) => {
    const order: KanbanCardItem['column'][] = ['todo', 'doing', 'done'];
    const next = cards.map((c) => {
      if (c.id !== id) return c;
      const idx = order.indexOf(c.column);
      const nextCol = order[Math.max(0, Math.min(order.length - 1, idx + dir))];
      return { ...c, column: nextCol };
    });
    syncCards(next);
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    syncCards([...cards, { id: \`k-\${Date.now()}\`, title: text, column: 'todo' }]);
    setDraft('');
  };

  const deleteCard = (id: string) => {
    syncCards(cards.filter((c) => c.id !== id));
  };

  return (
    <div className={\`w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${className}\`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {allowAdd && (
          <form onSubmit={addCard} className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nuova scheda..."
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              style={{ backgroundColor: accentColor }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
            >
              Aggiungi
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div key={col.id} className="rounded-xl bg-slate-50 p-3">
              <div className="mb-2.5 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{col.label}</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {colCards.length}
                </span>
              </div>

              <div className="space-y-2">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 shadow-2xs"
                  >
                    <p className="font-medium leading-snug">{card.title}</p>
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={colIdx === 0}
                          onClick={() => moveCard(card.id, -1)}
                          aria-label="Sposta a sinistra"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={colIdx === COLUMNS.length - 1}
                          onClick={() => moveCard(card.id, 1)}
                          aria-label="Sposta a destra"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCard(card.id)}
                        aria-label="Elimina scheda"
                        className="rounded p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;
