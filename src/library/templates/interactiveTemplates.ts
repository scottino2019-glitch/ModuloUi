export const QUIZ_TEMPLATE = `import React, { useState } from 'react';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizCardProps {
  title?: string;
  subtitle?: string;
  questions?: QuizQuestion[];
  showProgress?: boolean;
  showExplanation?: boolean;
  allowRetry?: boolean;
  accentColor?: string;
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: QuizCardProps = {
  title: "Verifica delle conoscenze",
  subtitle: "Seleziona la risposta corretta per ogni quesito",
  questions: [
    {
      id: "q1",
      prompt: "Quale principio migliora maggiormente la leggibilità di un testo lungo su schermo?",
      options: [
        "Ridurre l'interlinea al minimo",
        "Mantenere una larghezza di riga tra 60 e 75 caratteri",
        "Usare esclusivamente testo maiuscolo",
        "Eliminare tutti i margini laterali"
      ],
      correctIndex: 1,
      explanation: "Una misura compresa tra 60 e 75 caratteri evita affaticamento visivo nel passaggio da una riga alla successiva."
    },
    {
      id: "q2",
      prompt: "Che cos'è una prop 'children' in React?",
      options: [
        "Un attributo CSS riservato alle animazioni",
        "Una funzione per esportare file JSON",
        "Un segnaposto per inserire contenuto annidato nel componente",
        "Un metodo obbligatorio del ciclo di vita"
      ],
      correctIndex: 2,
      explanation: "La prop children consente di comporre componenti contenitori altamente flessibili ed estensibili."
    },
    {
      id: "q3",
      prompt: "Quale formato numerico mantiene allineate le cifre nelle tabelle?",
      options: [
        "Cifre tabellari (tabular-nums)",
        "Cifre proporzionali corsive",
        "Testo giustificato",
        "Spaziatura espansa"
      ],
      correctIndex: 0,
      explanation: "Le cifre tabellari assegnano a ogni numero la stessa larghezza orizzontale per un allineamento verticale preciso."
    }
  ],
  showProgress: true,
  showExplanation: true,
  allowRetry: true,
  accentColor: "#2563eb"
};

export default function QuizCard(props: QuizCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    subtitle = DEFAULT_PROPS.subtitle,
    questions = DEFAULT_PROPS.questions ?? [],
    showProgress = DEFAULT_PROPS.showProgress,
    showExplanation = DEFAULT_PROPS.showExplanation,
    allowRetry = DEFAULT_PROPS.allowRetry,
    accentColor = DEFAULT_PROPS.accentColor,
    onComplete,
    className = '',
  } = props;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <div className={\`w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 \${className}\`}>
        Nessuna domanda configurata.
      </div>
    );
  }

  const currentQuestion = questions[currentIdx] || questions[0];
  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  const handleSelect = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setSelectedOption(answers[next] ?? null);
    } else {
      const finalScore = questions.reduce((acc, q, idx) => {
        const chosen = idx === currentIdx ? selectedOption : answers[idx];
        return acc + (chosen === q.correctIndex ? 1 : 0);
      }, 0);
      setFinished(true);
      onComplete?.(finalScore, questions.length);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setFinished(false);
  };

  if (finished) {
    const score = questions.reduce(
      (acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0),
      0
    );
    const pct = Math.round((score / questions.length) * 100);

    return (
      <div className={\`w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm \${className}\`}>
        <div className="text-center py-4">
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            Riepilogo completato
          </p>
          <div
            style={{ color: accentColor }}
            className="mt-2 text-4xl font-bold font-mono tabular-nums"
          >
            {score} / {questions.length}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Hai risposto correttamente al <span className="font-semibold tabular-nums">{pct}%</span> dei quesiti.
          </p>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {questions.map((q, idx) => {
            const ok = answers[idx] === q.correctIndex;
            return (
              <div
                key={q.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs"
              >
                <span className="text-slate-700 leading-relaxed">
                  <span className="font-mono tabular-nums text-slate-400 mr-1.5">
                    0{idx + 1}.
                  </span>
                  {q.prompt}
                </span>
                <span
                  className={\`shrink-0 font-semibold \${
                    ok ? 'text-emerald-700' : 'text-rose-700'
                  }\`}
                >
                  {ok ? 'Corretta' : 'Errata'}
                </span>
              </div>
            );
          })}
        </div>

        {allowRetry && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              style={{ backgroundColor: accentColor }}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              Ripeti quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  const progressPct = ((currentIdx + (hasAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className={\`w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm \${className}\`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-500 shrink-0">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {showProgress && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            style={{ width: \`\${progressPct}%\`, backgroundColor: accentColor }}
            className="h-full transition-all duration-200"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="text-base font-medium text-slate-900 leading-snug">
          {currentQuestion.prompt}
        </p>

        <div className="mt-4 space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isRightOption = idx === currentQuestion.correctIndex;

            let optionClasses =
              'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
            if (hasAnswered) {
              if (isRightOption) {
                optionClasses = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium';
              } else if (isSelected && !isRightOption) {
                optionClasses = 'border-rose-500 bg-rose-50/70 text-rose-950';
              } else {
                optionClasses = 'border-slate-200 bg-white text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={\`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors \${
                  hasAnswered ? 'cursor-default' : 'cursor-pointer'
                } \${optionClasses}\`}
              >
                <span>{option}</span>
                {hasAnswered && isRightOption && (
                  <span className="text-xs font-semibold text-emerald-700 shrink-0">Esatta</span>
                )}
                {hasAnswered && isSelected && !isRightOption && (
                  <span className="text-xs font-semibold text-rose-700 shrink-0">Errata</span>
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && showExplanation && currentQuestion.explanation && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700">
            <span className="font-semibold text-slate-900 mr-1">
              {isCorrect ? 'Corretto:' : 'Spiegazione:'}
            </span>
            {currentQuestion.explanation}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={!hasAnswered}
          onClick={handleNext}
          style={hasAnswered ? { backgroundColor: accentColor } : undefined}
          className={\`rounded-lg px-4 py-2 text-xs font-medium transition-colors \${
            hasAnswered
              ? 'text-white hover:opacity-90 cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }\`}
        >
          {currentIdx < questions.length - 1 ? 'Prossima domanda' : 'Vedi risultato'}
        </button>
      </div>
    </div>
  );
}
`;

export const FLIPBOOK_TEMPLATE = `import React, { useState } from 'react';

export interface BookPage {
  heading: string;
  body: string;
  caption?: string;
}

export interface FlipBookCardProps {
  title?: string;
  author?: string;
  coverSubtitle?: string;
  coverColor?: string;
  pages?: BookPage[];
  showIndex?: boolean;
  accentColor?: string;
  onPageChange?: (pageIndex: number) => void;
  className?: string;
}

export const DEFAULT_PROPS: FlipBookCardProps = {
  title: "Manuale della Composizione",
  author: "Edizione di Studio",
  coverSubtitle: "Appunti brevi su proporzione, ritmo visivo e spaziature",
  coverColor: "#1e293b",
  pages: [
    {
      heading: "I. Il margine",
      body: "Ogni pagina inizia dal vuoto che la circonda. I margini non sono spazio sprecato, ma la cornice silenziosa che permette all'occhio di orientarsi con naturalezza.",
      caption: "Tavola 01 · Proporzioni"
    },
    {
      heading: "II. La misura",
      body: "Una colonna di testo equilibrata guida la lettura senza sforzo. Alternare paragrafi compatti a pause visive mantiene costante l'attenzione.",
      caption: "Tavola 02 · Ritmo"
    },
    {
      heading: "III. La gerarchia",
      body: "La differenza tra un titolo, un sottotitolo e il corpo del testo stabilisce l'ordine di lettura prima ancora che il lettore decifri le parole.",
      caption: "Tavola 03 · Scala"
    },
    {
      heading: "IV. L'estensione",
      body: "Un buon sistema di componenti nasce generico: ogni pagina può accogliere contenuti diversi mantenendo intatta la propria coerenza formale.",
      caption: "Tavola 04 · Sistema"
    }
  ],
  showIndex: true,
  accentColor: "#2563eb"
};

export default function FlipBookCard(props: FlipBookCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    author = DEFAULT_PROPS.author,
    coverSubtitle = DEFAULT_PROPS.coverSubtitle,
    coverColor = DEFAULT_PROPS.coverColor,
    pages = DEFAULT_PROPS.pages ?? [],
    showIndex = DEFAULT_PROPS.showIndex,
    accentColor = DEFAULT_PROPS.accentColor,
    onPageChange,
    className = '',
  } = props;

  // pageStep 0 = copertina, 1..pages.length = pagine interne
  const [pageStep, setPageStep] = useState(0);
  const [flipState, setFlipState] = useState<'idle' | 'next' | 'prev'>('idle');
  const [indexOpen, setIndexOpen] = useState(false);

  const totalSteps = pages.length;

  const goToStep = (nextStep: number, direction: 'next' | 'prev') => {
    const clamped = Math.max(0, Math.min(totalSteps, nextStep));
    if (clamped === pageStep) return;
    setFlipState(direction);
    window.setTimeout(() => {
      setPageStep(clamped);
      setFlipState('idle');
      onPageChange?.(clamped);
    }, 170);
  };

  const activePage = pageStep > 0 ? pages[pageStep - 1] : null;

  return (
    <div className={\`w-full max-w-xl select-none \${className}\`}>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Top Book Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-800">{title}</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {pageStep === 0 ? 'Copertina' : \`Pagina \${pageStep} di \${totalSteps}\`}
            </span>
          </div>

          {showIndex && pages.length > 0 && (
            <button
              type="button"
              onClick={() => setIndexOpen((o) => !o)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {indexOpen ? 'Chiudi indice' : 'Indice'}
            </button>
          )}
        </div>

        {indexOpen && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  goToStep(0, 'prev');
                  setIndexOpen(false);
                }}
                className={\`rounded-md px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer \${
                  pageStep === 0 ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-white'
                }\`}
              >
                00. Copertina
              </button>
              {pages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    goToStep(idx + 1, idx + 1 >= pageStep ? 'next' : 'prev');
                    setIndexOpen(false);
                  }}
                  className={\`rounded-md px-2.5 py-1.5 text-left text-xs truncate transition-colors cursor-pointer \${
                    pageStep === idx + 1 ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-white'
                  }\`}
                >
                  {String(idx + 1).padStart(2, '0')}. {p.heading}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book Stage with 3D perspective */}
        <div style={{ perspective: '1200px' }} className="relative">
          <div
            style={{
              transform:
                flipState === 'next'
                  ? 'rotateY(-14deg) scale(0.98)'
                  : flipState === 'prev'
                  ? 'rotateY(14deg) scale(0.98)'
                  : 'rotateY(0deg) scale(1)',
              transition: 'transform 170ms cubic-bezier(0.16, 1, 0.3, 1), opacity 170ms ease',
              opacity: flipState === 'idle' ? 1 : 0.72,
            }}
            className="relative min-h-[320px] rounded-xl overflow-hidden border border-slate-200 shadow-sm"
          >
            {pageStep === 0 ? (
              <div
                style={{ backgroundColor: coverColor }}
                className="flex min-h-[320px] flex-col justify-between p-8 text-white relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20" aria-hidden="true" />
                <div className="pl-3">
                  <p className="text-xs tracking-wider text-slate-300 font-medium">
                    {author}
                  </p>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight text-balance">
                    {title}
                  </h3>
                  {coverSubtitle && (
                    <p className="mt-3 text-sm text-slate-300 max-w-sm leading-relaxed">
                      {coverSubtitle}
                    </p>
                  )}
                </div>

                <div className="pl-3 flex items-center justify-between pt-6 border-t border-white/15">
                  <span className="text-xs font-mono tabular-nums text-slate-300">
                    {totalSteps} pagine
                  </span>
                  <button
                    type="button"
                    onClick={() => goToStep(1, 'next')}
                    style={{ backgroundColor: accentColor }}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
                  >
                    Sfoglia il libro
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col justify-between bg-[#fcfbf8] p-7 sm:p-9 relative">
                {/* Book Spine Shadow */}
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-slate-900/8 to-transparent"
                  aria-hidden="true"
                />
                <div className="pl-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>{activePage?.caption || title}</span>
                    <span className="font-mono tabular-nums">
                      {String(pageStep).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {activePage?.heading}
                  </h4>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700">
                    {activePage?.body}
                  </p>
                </div>

                <div className="pl-2 mt-8 flex items-center justify-between border-t border-slate-200/70 pt-4 text-xs text-slate-500">
                  <span>{author}</span>
                  <span className="font-mono tabular-nums">
                    {pageStep} / {totalSteps}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Turning Controls */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={pageStep === 0}
            onClick={() => goToStep(pageStep - 1, 'prev')}
            className={\`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors \${
              pageStep === 0
                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
            }\`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Precedente
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={idx === 0 ? 'Copertina' : \`Pagina \${idx}\`}
                onClick={() => goToStep(idx, idx >= pageStep ? 'next' : 'prev')}
                style={idx === pageStep ? { backgroundColor: accentColor } : undefined}
                className={\`h-2 rounded-full transition-all cursor-pointer \${
                  idx === pageStep ? 'w-5' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }\`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={pageStep >= totalSteps}
            onClick={() => goToStep(pageStep + 1, 'next')}
            className={\`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors \${
              pageStep >= totalSteps
                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
            }\`}
          >
            Successiva
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export const NOTEBOOK_TEMPLATE = `import React, { useState } from 'react';

export interface NotebookPage {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  bookmarked?: boolean;
}

export interface NotebookCardProps {
  title?: string;
  paperStyle?: 'lined' | 'grid' | 'dotted' | 'blank';
  initialPages?: NotebookPage[];
  allowAddPage?: boolean;
  allowExport?: boolean;
  accentColor?: string;
  onPagesChange?: (pages: NotebookPage[]) => void;
  className?: string;
}

export const DEFAULT_PROPS: NotebookCardProps = {
  title: "Taccuino di appunti",
  paperStyle: "lined",
  initialPages: [
    {
      id: "nota-1",
      title: "Appunti di struttura",
      content: "Organizzare ogni sezione attorno a un singolo punto focale.\\nMantenere le etichette brevi e su una sola riga.\\nVerificare il contrasto su sfondi chiari e scuri.",
      updatedAt: "Oggi, 10:15",
      bookmarked: true
    },
    {
      id: "nota-2",
      title: "Idee da sviluppare",
      content: "- Esportazione rapida in testo semplice\\n- Navigazione lineare tra le pagine\\n- Supporto per carta a righe o quadretti",
      updatedAt: "Ieri, 18:40",
      bookmarked: false
    }
  ],
  allowAddPage: true,
  allowExport: true,
  accentColor: "#2563eb"
};

export default function NotebookCard(props: NotebookCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    paperStyle = DEFAULT_PROPS.paperStyle,
    initialPages = DEFAULT_PROPS.initialPages ?? [],
    allowAddPage = DEFAULT_PROPS.allowAddPage,
    allowExport = DEFAULT_PROPS.allowExport,
    accentColor = DEFAULT_PROPS.accentColor,
    onPagesChange,
    className = '',
  } = props;

  const [pages, setPages] = useState<NotebookPage[]>(initialPages);
  const [activeId, setActiveId] = useState<string>(initialPages[0]?.id || '');

  const currentPage = pages.find((p) => p.id === activeId) || pages[0];

  const updatePages = (next: NotebookPage[]) => {
    setPages(next);
    onPagesChange?.(next);
  };

  const handleEditCurrent = (patch: Partial<NotebookPage>) => {
    if (!currentPage) return;
    const nowLabel = new Date().toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const next = pages.map((p) =>
      p.id === currentPage.id ? { ...p, ...patch, updatedAt: \`Oggi, \${nowLabel}\` } : p
    );
    updatePages(next);
  };

  const handleAddPage = () => {
    const newId = \`nota-\${Date.now()}\`;
    const newPage: NotebookPage = {
      id: newId,
      title: \`Nuova pagina \${pages.length + 1}\`,
      content: '',
      updatedAt: 'Adesso',
      bookmarked: false,
    };
    updatePages([...pages, newPage]);
    setActiveId(newId);
  };

  const handleDeletePage = (id: string) => {
    if (pages.length <= 1) return;
    const next = pages.filter((p) => p.id !== id);
    updatePages(next);
    if (activeId === id) {
      setActiveId(next[0]?.id || '');
    }
  };

  const handleExportTxt = () => {
    if (!currentPage) return;
    const blob = new Blob([\`\${currentPage.title}\\n\\n\${currentPage.content}\`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${currentPage.title.toLowerCase().replace(/\\s+/g, '-') || 'nota'}.txt\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const paperBackground: React.CSSProperties =
    paperStyle === 'lined'
      ? {
          backgroundImage: 'linear-gradient(to bottom, transparent 27px, #e2e8f0 28px)',
          backgroundSize: '100% 28px',
        }
      : paperStyle === 'grid'
      ? {
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }
      : paperStyle === 'dotted'
      ? {
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }
      : {};

  const wordCount = currentPage?.content.trim()
    ? currentPage.content.trim().split(/\\s+/).length
    : 0;

  return (
    <div className={\`w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm \${className}\`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-mono tabular-nums">
            {pages.length} {pages.length === 1 ? 'pagina' : 'pagine'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allowExport && currentPage && (
            <button
              type="button"
              onClick={handleExportTxt}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Esporta .txt
            </button>
          )}
          {allowAddPage && (
            <button
              type="button"
              onClick={handleAddPage}
              style={{ backgroundColor: accentColor }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 cursor-pointer"
            >
              Nuova pagina
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Pages List */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-3">
          <ul className="space-y-1">
            {pages.map((p) => {
              const isSelected = p.id === currentPage?.id;
              return (
                <li key={p.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    style={isSelected ? { borderColor: accentColor } : undefined}
                    className={\`flex-1 min-w-0 rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer \${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'border-transparent text-slate-600 hover:bg-white'
                    }\`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-medium truncate">{p.title || 'Senza titolo'}</span>
                      {p.bookmarked && (
                        <span style={{ color: accentColor }} className="text-[10px] font-semibold shrink-0">
                          ★
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400 truncate">
                      {p.updatedAt}
                    </div>
                  </button>
                  {pages.length > 1 && (
                    <button
                      type="button"
                      aria-label={\`Elimina \${p.title}\`}
                      onClick={() => handleDeletePage(p.id)}
                      className="opacity-60 hover:opacity-100 rounded p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Paper Sheet */}
        {currentPage && (
          <div className="md:col-span-8 flex flex-col bg-[#fffef9]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
              <input
                type="text"
                aria-label="Titolo della nota"
                value={currentPage.title}
                onChange={(e) => handleEditCurrent({ title: e.target.value })}
                placeholder="Titolo pagina..."
                className="w-full bg-transparent text-base font-semibold text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Segnalibro"
                onClick={() => handleEditCurrent({ bookmarked: !currentPage.bookmarked })}
                style={currentPage.bookmarked ? { color: accentColor } : undefined}
                className={\`shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer \${
                  currentPage.bookmarked
                    ? 'bg-slate-100'
                    : 'text-slate-400 hover:text-slate-700'
                }\`}
              >
                {currentPage.bookmarked ? 'Preferita' : 'Segna'}
              </button>
            </div>

            <textarea
              aria-label="Contenuto della nota"
              value={currentPage.content}
              onChange={(e) => handleEditCurrent({ content: e.target.value })}
              placeholder="Scrivi i tuoi appunti qui..."
              style={paperBackground}
              className="min-h-[240px] w-full resize-none bg-transparent px-5 py-3 text-sm leading-[28px] text-slate-800 focus:outline-none"
            />

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-2.5 text-xs text-slate-400 font-mono tabular-nums">
              <span>{wordCount} parole</span>
              <span>Aggiornato: {currentPage.updatedAt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

export const TASK_BOARD_TEMPLATE = `import React, { useState } from 'react';

export interface TaskItem {
  id: string;
  label: string;
  category: string;
  completed: boolean;
  priority: 'bassa' | 'media' | 'alta';
}

export interface TaskBoardCardProps {
  title?: string;
  subtitle?: string;
  initialTasks?: TaskItem[];
  allowAdd?: boolean;
  allowFilter?: boolean;
  showProgress?: boolean;
  accentColor?: string;
  onTasksChange?: (tasks: TaskItem[]) => void;
  className?: string;
}

export const DEFAULT_PROPS: TaskBoardCardProps = {
  title: "Lista attività",
  subtitle: "Gestione rapida delle priorità giornaliere",
  initialTasks: [
    {
      id: "t1",
      label: "Definire la struttura delle props principali",
      category: "Architettura",
      completed: true,
      priority: "alta"
    },
    {
      id: "t2",
      label: "Verificare l'allineamento su schermo mobile",
      category: "Interfaccia",
      completed: false,
      priority: "media"
    },
    {
      id: "t3",
      label: "Documentare gli esempi d'uso generici",
      category: "Note",
      completed: false,
      priority: "bassa"
    }
  ],
  allowAdd: true,
  allowFilter: true,
  showProgress: true,
  accentColor: "#2563eb"
};

export default function TaskBoardCard(props: TaskBoardCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    subtitle = DEFAULT_PROPS.subtitle,
    initialTasks = DEFAULT_PROPS.initialTasks ?? [],
    allowAdd = DEFAULT_PROPS.allowAdd,
    allowFilter = DEFAULT_PROPS.allowFilter,
    showProgress = DEFAULT_PROPS.showProgress,
    accentColor = DEFAULT_PROPS.accentColor,
    onTasksChange,
    className = '',
  } = props;

  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [draftLabel, setDraftLabel] = useState('');
  const [draftPriority, setDraftPriority] = useState<'bassa' | 'media' | 'alta'>('media');

  const updateTasks = (next: TaskItem[]) => {
    setTasks(next);
    onTasksChange?.(next);
  };

  const handleToggle = (id: string) => {
    updateTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftLabel.trim();
    if (!trimmed) return;
    const newTask: TaskItem = {
      id: \`task-\${Date.now()}\`,
      label: trimmed,
      category: 'Generale',
      completed: false,
      priority: draftPriority,
    };
    updateTasks([newTask, ...tasks]);
    setDraftLabel('');
  };

  const handleDelete = (id: string) => {
    updateTasks(tasks.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  return (
    <div className={\`w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm \${className}\`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-500 shrink-0">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              style={{ width: \`\${progressPct}%\`, backgroundColor: accentColor }}
              className="h-full transition-all duration-200"
            />
          </div>
        </div>
      )}

      {allowAdd && (
        <form onSubmit={handleAdd} className="mt-4 flex flex-wrap sm:flex-nowrap gap-2">
          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="Aggiungi una nuova attività..."
            className="flex-1 min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
          <select
            aria-label="Priorità"
            value={draftPriority}
            onChange={(e) => setDraftPriority(e.target.value as 'bassa' | 'media' | 'alta')}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          <button
            type="submit"
            style={{ backgroundColor: accentColor }}
            className="rounded-lg px-4 py-2 text-xs font-medium text-white hover:opacity-90 whitespace-nowrap cursor-pointer"
          >
            Aggiungi
          </button>
        </form>
      )}

      {allowFilter && (
        <div className="mt-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(
              [
                { id: 'all', label: 'Tutte' },
                { id: 'active', label: 'Da fare' },
                { id: 'done', label: 'Completate' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={\`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer \${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }\`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => updateTasks(tasks.filter((t) => !t.completed))}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Rimuovi completate
            </button>
          )}
        </div>
      )}

      <ul className="mt-3 divide-y divide-slate-100">
        {visibleTasks.length === 0 ? (
          <li className="py-8 text-center text-xs text-slate-400">
            Nessuna attività in questa vista.
          </li>
        ) : (
          visibleTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 py-3 group"
            >
              <label className="flex flex-1 min-w-0 items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  style={{ accentColor }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 cursor-pointer"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={\`text-sm transition-colors \${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }\`}
                  >
                    {task.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        task.priority === 'alta'
                          ? 'text-amber-700 font-medium'
                          : 'text-slate-400'
                      }
                    >
                      Priorità {task.priority}
                    </span>
                  </div>
                </div>
              </label>

              <button
                type="button"
                aria-label={\`Elimina \${task.label}\`}
                onClick={() => handleDelete(task.id)}
                className="rounded p-1.5 text-slate-300 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
`;
