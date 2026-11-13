export const QUIZ_PURE = {
  tsx: `import React, { useState } from 'react';

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
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

export default function QuizCard({
  title = 'Verifica delle conoscenze',
  subtitle = 'Seleziona la risposta corretta per ogni quesito',
  questions = [
    {
      id: 'q1',
      prompt: 'Quale principio migliora maggiormente la leggibilità di un testo lungo su schermo?',
      options: [
        "Ridurre l'interlinea al minimo",
        'Mantenere una larghezza di riga tra 60 e 75 caratteri',
        'Usare esclusivamente testo maiuscolo',
        'Eliminare tutti i margini laterali',
      ],
      correctIndex: 1,
      explanation:
        'Una misura compresa tra 60 e 75 caratteri evita affaticamento visivo nel passaggio da una riga alla successiva.',
    },
    {
      id: 'q2',
      prompt: "Che cos'è una prop 'children' in React?",
      options: [
        'Un attributo CSS riservato alle animazioni',
        'Una funzione per esportare file JSON',
        'Un segnaposto per inserire contenuto annidato nel componente',
        'Un metodo obbligatorio del ciclo di vita',
      ],
      correctIndex: 2,
      explanation:
        'La prop children consente di comporre componenti contenitori altamente flessibili ed estensibili.',
    },
    {
      id: 'q3',
      prompt: 'Quale formato numerico mantiene allineate le cifre nelle tabelle?',
      options: [
        'Cifre tabellari (tabular-nums)',
        'Cifre proporzionali corsive',
        'Testo giustificato',
        'Spaziatura espansa',
      ],
      correctIndex: 0,
      explanation:
        'Le cifre tabellari assegnano a ogni numero la stessa larghezza orizzontale per un allineamento verticale preciso.',
    },
  ],
  showProgress = true,
  showExplanation = true,
  allowRetry = true,
  onComplete,
  className = '',
}: QuizCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return <div className={\`mui-quiz \${className}\`}>Nessuna domanda configurata.</div>;
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
      <div className={\`mui-quiz \${className}\`}>
        <div className="mui-quiz-summary">
          <p className="mui-quiz-sub">Riepilogo completato</p>
          <div className="mui-quiz-score">
            {score} / {questions.length}
          </div>
          <p className="mui-quiz-desc">
            Hai risposto correttamente al <strong>{pct}%</strong> dei quesiti.
          </p>
        </div>

        <div className="mui-quiz-review">
          {questions.map((q, idx) => {
            const ok = answers[idx] === q.correctIndex;
            return (
              <div key={q.id} className="mui-quiz-review-row">
                <span>
                  <span className="mui-quiz-num">0{idx + 1}.</span> {q.prompt}
                </span>
                <span className={\`mui-quiz-badge \${ok ? 'is-ok' : 'is-ko'}\`}>
                  {ok ? 'Corretta' : 'Errata'}
                </span>
              </div>
            );
          })}
        </div>

        {allowRetry && (
          <div className="mui-quiz-retry-wrap">
            <button type="button" onClick={handleReset} className="mui-quiz-btn-primary">
              Ripeti quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  const progressPct = ((currentIdx + (hasAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className={\`mui-quiz \${className}\`}>
      <div className="mui-quiz-top">
        <div>
          <h3 className="mui-quiz-title">{title}</h3>
          {subtitle && <p className="mui-quiz-sub">{subtitle}</p>}
        </div>
        <span className="mui-quiz-counter">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {showProgress && (
        <div className="mui-quiz-progress">
          <div className="mui-quiz-progress-fill" style={{ width: \`\${progressPct}%\` }} />
        </div>
      )}

      <div className="mui-quiz-body">
        <p className="mui-quiz-prompt">{currentQuestion.prompt}</p>

        <div className="mui-quiz-options">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isRight = idx === currentQuestion.correctIndex;
            let stateClass = '';
            if (hasAnswered) {
              if (isRight) stateClass = 'is-correct';
              else if (isSelected) stateClass = 'is-wrong';
              else stateClass = 'is-dim';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={\`mui-quiz-option \${stateClass}\`}
              >
                <span>{option}</span>
                {hasAnswered && isRight && <span className="mui-quiz-tag-ok">Esatta</span>}
                {hasAnswered && isSelected && !isRight && (
                  <span className="mui-quiz-tag-ko">Errata</span>
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && showExplanation && currentQuestion.explanation && (
          <div className="mui-quiz-explain">
            <strong>{isCorrect ? 'Corretto:' : 'Spiegazione:'}</strong>{' '}
            {currentQuestion.explanation}
          </div>
        )}
      </div>

      <div className="mui-quiz-footer">
        <button
          type="button"
          disabled={!hasAnswered}
          onClick={handleNext}
          className="mui-quiz-btn-primary"
        >
          {currentIdx < questions.length - 1 ? 'Prossima domanda' : 'Vedi risultato'}
        </button>
      </div>
    </div>
  );
}
`,
  css: `.mui-quiz {
  width: 100%;
  max-width: 560px;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-quiz-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.mui-quiz-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.mui-quiz-sub {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.mui-quiz-counter {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
  flex-shrink: 0;
}

.mui-quiz-progress {
  margin-top: 16px;
  height: 6px;
  border-radius: 999px;
  background-color: #f1f5f9;
  overflow: hidden;
}

.mui-quiz-progress-fill {
  height: 100%;
  background-color: #2563eb;
  transition: width 0.2s ease;
}

.mui-quiz-body {
  margin-top: 22px;
}

.mui-quiz-prompt {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
  color: #0f172a;
}

.mui-quiz-options {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mui-quiz-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.mui-quiz-option:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #94a3b8;
}

.mui-quiz-option.is-correct {
  border-color: #16a34a;
  background-color: #f0fdf4;
  color: #14532d;
  font-weight: 600;
}

.mui-quiz-option.is-wrong {
  border-color: #dc2626;
  background-color: #fef2f2;
  color: #7f1d1d;
}

.mui-quiz-option.is-dim {
  color: #94a3b8;
}

.mui-quiz-tag-ok {
  font-size: 0.78rem;
  font-weight: 700;
  color: #15803d;
  flex-shrink: 0;
}

.mui-quiz-tag-ko {
  font-size: 0.78rem;
  font-weight: 700;
  color: #b91c1c;
  flex-shrink: 0;
}

.mui-quiz-explain {
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.84rem;
  line-height: 1.55;
  color: #334155;
}

.mui-quiz-footer {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.mui-quiz-btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-quiz-btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.mui-quiz-btn-primary:disabled {
  background-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.mui-quiz-summary {
  text-align: center;
  padding: 12px 0;
}

.mui-quiz-score {
  margin-top: 8px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 2.25rem;
  font-weight: 700;
  color: #2563eb;
}

.mui-quiz-desc {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #475569;
}

.mui-quiz-review {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mui-quiz-review-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #334155;
}

.mui-quiz-num {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #94a3b8;
}

.mui-quiz-badge {
  font-weight: 700;
  flex-shrink: 0;
}

.mui-quiz-badge.is-ok {
  color: #15803d;
}

.mui-quiz-badge.is-ko {
  color: #b91c1c;
}

.mui-quiz-retry-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
`,
};

export const FLIPBOOK_PURE = {
  tsx: `import React, { useState } from 'react';

export interface BookPage {
  heading: string;
  body: string;
  caption?: string;
}

export interface FlipBookCardProps {
  title?: string;
  author?: string;
  coverSubtitle?: string;
  pages?: BookPage[];
  showIndex?: boolean;
  onPageChange?: (pageIndex: number) => void;
  className?: string;
}

export default function FlipBookCard({
  title = 'Manuale della Composizione',
  author = 'Edizione di Studio',
  coverSubtitle = 'Appunti brevi su proporzione, ritmo visivo e spaziature',
  pages = [
    {
      heading: 'I. Il margine',
      body: "Ogni pagina inizia dal vuoto che la circonda. I margini non sono spazio sprecato, ma la cornice silenziosa che permette all'occhio di orientarsi con naturalezza.",
      caption: 'Tavola 01 · Proporzioni',
    },
    {
      heading: 'II. La misura',
      body: "Una colonna di testo equilibrata guida la lettura senza sforzo. Alternare paragrafi compatti a pause visive mantiene costante l'attenzione.",
      caption: 'Tavola 02 · Ritmo',
    },
    {
      heading: 'III. La gerarchia',
      body: "La differenza tra un titolo, un sottotitolo e il corpo del testo stabilisce l'ordine di lettura prima ancora che il lettore decifri le parole.",
      caption: 'Tavola 03 · Scala',
    },
    {
      heading: "IV. L'estensione",
      body: 'Un buon sistema di componenti nasce generico: ogni pagina può accogliere contenuti diversi mantenendo intatta la propria coerenza formale.',
      caption: 'Tavola 04 · Sistema',
    },
  ],
  showIndex = true,
  onPageChange,
  className = '',
}: FlipBookCardProps) {
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
    <div className={\`mui-book \${className}\`}>
      <div className="mui-book-top">
        <div className="mui-book-meta">
          <strong>{title}</strong>
          <span>·</span>
          <span className="mui-book-step">
            {pageStep === 0 ? 'Copertina' : \`Pagina \${pageStep} di \${totalSteps}\`}
          </span>
        </div>

        {showIndex && pages.length > 0 && (
          <button
            type="button"
            onClick={() => setIndexOpen((o) => !o)}
            className="mui-book-idx-btn"
          >
            {indexOpen ? 'Chiudi indice' : 'Indice'}
          </button>
        )}
      </div>

      {indexOpen && (
        <div className="mui-book-index">
          <button
            type="button"
            onClick={() => {
              goToStep(0, 'prev');
              setIndexOpen(false);
            }}
            className={\`mui-book-idx-item \${pageStep === 0 ? 'is-active' : ''}\`}
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
              className={\`mui-book-idx-item \${pageStep === idx + 1 ? 'is-active' : ''}\`}
            >
              {String(idx + 1).padStart(2, '0')}. {p.heading}
            </button>
          ))}
        </div>
      )}

      <div className="mui-book-perspective">
        <div className={\`mui-book-stage is-\${flipState}\`}>
          {pageStep === 0 ? (
            <div className="mui-book-cover">
              <div className="mui-book-cover-spine" aria-hidden="true" />
              <div className="mui-book-cover-inner">
                <p className="mui-book-author">{author}</p>
                <h3 className="mui-book-cover-title">{title}</h3>
                {coverSubtitle && <p className="mui-book-cover-sub">{coverSubtitle}</p>}
              </div>
              <div className="mui-book-cover-footer">
                <span>{totalSteps} pagine</span>
                <button
                  type="button"
                  onClick={() => goToStep(1, 'next')}
                  className="mui-book-open-btn"
                >
                  Sfoglia il libro
                </button>
              </div>
            </div>
          ) : (
            <div className="mui-book-page">
              <div className="mui-book-page-spine" aria-hidden="true" />
              <div className="mui-book-page-inner">
                <div className="mui-book-page-head">
                  <span>{activePage?.caption || title}</span>
                  <span>{String(pageStep).padStart(2, '0')}</span>
                </div>
                <h4 className="mui-book-page-title">{activePage?.heading}</h4>
                <p className="mui-book-page-text">{activePage?.body}</p>
              </div>
              <div className="mui-book-page-footer">
                <span>{author}</span>
                <span>
                  {pageStep} / {totalSteps}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mui-book-nav">
        <button
          type="button"
          disabled={pageStep === 0}
          onClick={() => goToStep(pageStep - 1, 'prev')}
          className="mui-book-nav-btn"
        >
          ← Precedente
        </button>

        <div className="mui-book-dots">
          {Array.from({ length: totalSteps + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={idx === 0 ? 'Copertina' : \`Pagina \${idx}\`}
              onClick={() => goToStep(idx, idx >= pageStep ? 'next' : 'prev')}
              className={\`mui-book-dot \${idx === pageStep ? 'is-active' : ''}\`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={pageStep >= totalSteps}
          onClick={() => goToStep(pageStep + 1, 'next')}
          className="mui-book-nav-btn"
        >
          Successiva →
        </button>
      </div>
    </div>
  );
}
`,
  css: `.mui-book {
  width: 100%;
  max-width: 560px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  user-select: none;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-book-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.mui-book-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #64748b;
}

.mui-book-meta strong {
  color: #0f172a;
}

.mui-book-step {
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.mui-book-idx-btn {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
}

.mui-book-idx-btn:hover {
  background-color: #f8fafc;
}

.mui-book-index {
  margin-bottom: 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.mui-book-idx-item {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  text-align: left;
  font-size: 0.8rem;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mui-book-idx-item:hover {
  background-color: #ffffff;
}

.mui-book-idx-item.is-active {
  background-color: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.mui-book-perspective {
  perspective: 1200px;
}

.mui-book-stage {
  min-height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: transform 0.17s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.17s ease;
}

.mui-book-stage.is-next {
  transform: rotateY(-14deg) scale(0.98);
  opacity: 0.72;
}

.mui-book-stage.is-prev {
  transform: rotateY(14deg) scale(0.98);
  opacity: 0.72;
}

.mui-book-cover {
  position: relative;
  min-height: 320px;
  background-color: #1e293b;
  color: #ffffff;
  padding: 32px 32px 26px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mui-book-cover-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14px;
  background-color: rgba(0, 0, 0, 0.25);
}

.mui-book-author {
  margin: 0;
  font-size: 0.8rem;
  color: #cbd5e1;
  letter-spacing: 0.04em;
}

.mui-book-cover-title {
  margin: 16px 0 0;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.mui-book-cover-sub {
  margin: 12px 0 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: #cbd5e1;
  max-width: 380px;
}

.mui-book-cover-footer {
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.mui-book-open-btn {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-book-open-btn:hover {
  background-color: #1d4ed8;
}

.mui-book-page {
  position: relative;
  min-height: 320px;
  background-color: #fcfbf8;
  color: #0f172a;
  padding: 30px 32px 22px 38px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mui-book-page-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 22px;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.09), transparent);
}

.mui-book-page-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 16px;
}

.mui-book-page-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.mui-book-page-text {
  margin: 16px 0 0;
  font-size: 0.98rem;
  line-height: 1.7;
  color: #334155;
}

.mui-book-page-footer {
  margin-top: 28px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-book-nav {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mui-book-nav-btn {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-book-nav-btn:hover:not(:disabled) {
  background-color: #f8fafc;
}

.mui-book-nav-btn:disabled {
  border-color: #f1f5f9;
  color: #cbd5e1;
  cursor: not-allowed;
}

.mui-book-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mui-book-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background-color: #cbd5e1;
  cursor: pointer;
  transition: width 0.2s ease, background-color 0.2s ease;
}

.mui-book-dot.is-active {
  width: 20px;
  background-color: #2563eb;
}
`,
};

export const NOTEBOOK_PURE = {
  tsx: `import React, { useState } from 'react';

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
  onPagesChange?: (pages: NotebookPage[]) => void;
  className?: string;
}

export default function NotebookCard({
  title = 'Taccuino di appunti',
  paperStyle = 'lined',
  initialPages = [
    {
      id: 'nota-1',
      title: 'Appunti di struttura',
      content:
        'Organizzare ogni sezione attorno a un singolo punto focale.\\nMantenere le etichette brevi e su una sola riga.\\nVerificare il contrasto su sfondi chiari e scuri.',
      updatedAt: 'Oggi, 10:15',
      bookmarked: true,
    },
    {
      id: 'nota-2',
      title: 'Idee da sviluppare',
      content:
        '- Esportazione rapida in testo semplice\\n- Navigazione lineare tra le pagine\\n- Supporto per carta a righe o quadretti',
      updatedAt: 'Ieri, 18:40',
      bookmarked: false,
    },
  ],
  allowAddPage = true,
  allowExport = true,
  onPagesChange,
  className = '',
}: NotebookCardProps) {
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

  const wordCount = currentPage?.content.trim()
    ? currentPage.content.trim().split(/\\s+/).length
    : 0;

  return (
    <div className={\`mui-notebook \${className}\`}>
      <div className="mui-notebook-top">
        <div>
          <h3 className="mui-notebook-title">{title}</h3>
          <p className="mui-notebook-count">
            {pages.length} {pages.length === 1 ? 'pagina' : 'pagine'}
          </p>
        </div>

        <div className="mui-notebook-actions">
          {allowExport && currentPage && (
            <button type="button" onClick={handleExportTxt} className="mui-notebook-btn-sec">
              Esporta .txt
            </button>
          )}
          {allowAddPage && (
            <button type="button" onClick={handleAddPage} className="mui-notebook-btn-pri">
              Nuova pagina
            </button>
          )}
        </div>
      </div>

      <div className="mui-notebook-grid">
        <div className="mui-notebook-sidebar">
          <ul className="mui-notebook-list">
            {pages.map((p) => {
              const isSelected = p.id === currentPage?.id;
              return (
                <li key={p.id} className="mui-notebook-row">
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    className={\`mui-notebook-item \${isSelected ? 'is-active' : ''}\`}
                  >
                    <div className="mui-notebook-item-top">
                      <span>{p.title || 'Senza titolo'}</span>
                      {p.bookmarked && <span className="mui-notebook-star">★</span>}
                    </div>
                    <div className="mui-notebook-item-date">{p.updatedAt}</div>
                  </button>
                  {pages.length > 1 && (
                    <button
                      type="button"
                      aria-label={\`Elimina \${p.title}\`}
                      onClick={() => handleDeletePage(p.id)}
                      className="mui-notebook-del"
                    >
                      ✕
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {currentPage && (
          <div className="mui-notebook-sheet">
            <div className="mui-notebook-sheet-head">
              <input
                type="text"
                aria-label="Titolo della nota"
                value={currentPage.title}
                onChange={(e) => handleEditCurrent({ title: e.target.value })}
                placeholder="Titolo pagina..."
                className="mui-notebook-input-title"
              />
              <button
                type="button"
                onClick={() => handleEditCurrent({ bookmarked: !currentPage.bookmarked })}
                className={\`mui-notebook-bookmark \${currentPage.bookmarked ? 'is-on' : ''}\`}
              >
                {currentPage.bookmarked ? 'Preferita' : 'Segna'}
              </button>
            </div>

            <textarea
              aria-label="Contenuto della nota"
              value={currentPage.content}
              onChange={(e) => handleEditCurrent({ content: e.target.value })}
              placeholder="Scrivi i tuoi appunti qui..."
              className={\`mui-notebook-textarea paper-\${paperStyle}\`}
            />

            <div className="mui-notebook-sheet-foot">
              <span>{wordCount} parole</span>
              <span>Aggiornato: {currentPage.updatedAt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`,
  css: `.mui-notebook {
  width: 100%;
  max-width: 660px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-notebook-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.mui-notebook-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-notebook-count {
  margin: 2px 0 0;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-notebook-actions {
  display: flex;
  gap: 8px;
}

.mui-notebook-btn-sec {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-notebook-btn-pri {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-notebook-grid {
  display: grid;
  grid-template-columns: 210px 1fr;
}

.mui-notebook-sidebar {
  border-right: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 12px;
}

.mui-notebook-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mui-notebook-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mui-notebook-item {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  color: #475569;
}

.mui-notebook-item:hover {
  background-color: #ffffff;
}

.mui-notebook-item.is-active {
  background-color: #ffffff;
  border-color: #2563eb;
  color: #0f172a;
}

.mui-notebook-item-top {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.mui-notebook-item-top span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mui-notebook-star {
  color: #2563eb;
}

.mui-notebook-item-date {
  margin-top: 2px;
  font-size: 0.72rem;
  color: #94a3b8;
}

.mui-notebook-del {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.mui-notebook-del:hover {
  color: #dc2626;
}

.mui-notebook-sheet {
  display: flex;
  flex-direction: column;
  background-color: #fffef9;
}

.mui-notebook-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.mui-notebook-input-title {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  outline: none;
}

.mui-notebook-bookmark {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.mui-notebook-bookmark.is-on {
  background-color: #eff6ff;
  color: #2563eb;
}

.mui-notebook-textarea {
  width: 100%;
  min-height: 240px;
  border: none;
  resize: none;
  background-color: transparent;
  padding: 8px 20px;
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 28px;
  color: #1e293b;
  outline: none;
}

.mui-notebook-textarea.paper-lined {
  background-image: linear-gradient(to bottom, transparent 27px, #e2e8f0 28px);
  background-size: 100% 28px;
}

.mui-notebook-textarea.paper-grid {
  background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
  background-size: 22px 22px;
}

.mui-notebook-textarea.paper-dotted {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 18px 18px;
}

.mui-notebook-sheet-foot {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #f1f5f9;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .mui-notebook-grid {
    grid-template-columns: 1fr;
  }
  .mui-notebook-sidebar {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
}
`,
};

export const MINI_TASK_PURE = {
  tsx: `import React, { useState } from 'react';

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
  onTasksChange?: (tasks: TaskItem[]) => void;
  className?: string;
}

export default function TaskBoardCard({
  title = 'Lista attività',
  subtitle = 'Gestione rapida delle priorità giornaliere',
  initialTasks = [
    {
      id: 't1',
      label: 'Definire la struttura delle props principali',
      category: 'Architettura',
      completed: true,
      priority: 'alta',
    },
    {
      id: 't2',
      label: "Verificare l'allineamento su schermo mobile",
      category: 'Interfaccia',
      completed: false,
      priority: 'media',
    },
    {
      id: 't3',
      label: "Documentare gli esempi d'uso generici",
      category: 'Note',
      completed: false,
      priority: 'bassa',
    },
  ],
  allowAdd = true,
  allowFilter = true,
  showProgress = true,
  onTasksChange,
  className = '',
}: TaskBoardCardProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [draftLabel, setDraftLabel] = useState('');
  const [draftPriority, setDraftPriority] = useState<'bassa' | 'media' | 'alta'>('media');

  const updateTasks = (next: TaskItem[]) => {
    setTasks(next);
    onTasksChange?.(next);
  };

  const handleToggle = (id: string) => {
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
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
    <div className={\`mui-tasks \${className}\`}>
      <div className="mui-tasks-top">
        <div>
          <h3 className="mui-tasks-title">{title}</h3>
          {subtitle && <p className="mui-tasks-sub">{subtitle}</p>}
        </div>
        <span className="mui-tasks-count">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {showProgress && (
        <div className="mui-tasks-bar">
          <div className="mui-tasks-bar-fill" style={{ width: \`\${progressPct}%\` }} />
        </div>
      )}

      {allowAdd && (
        <form onSubmit={handleAdd} className="mui-tasks-form">
          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="Aggiungi una nuova attività..."
            className="mui-tasks-input"
          />
          <select
            aria-label="Priorità"
            value={draftPriority}
            onChange={(e) => setDraftPriority(e.target.value as 'bassa' | 'media' | 'alta')}
            className="mui-tasks-select"
          >
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          <button type="submit" className="mui-tasks-add">
            Aggiungi
          </button>
        </form>
      )}

      {allowFilter && (
        <div className="mui-tasks-filters">
          <div className="mui-tasks-tabs">
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
                className={\`mui-tasks-tab \${filter === tab.id ? 'is-active' : ''}\`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => updateTasks(tasks.filter((t) => !t.completed))}
              className="mui-tasks-clear"
            >
              Rimuovi completate
            </button>
          )}
        </div>
      )}

      <ul className="mui-tasks-list">
        {visibleTasks.length === 0 ? (
          <li className="mui-tasks-empty">Nessuna attività in questa vista.</li>
        ) : (
          visibleTasks.map((task) => (
            <li key={task.id} className="mui-tasks-item">
              <label className="mui-tasks-check-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  className="mui-tasks-checkbox"
                />
                <div>
                  <p className={\`mui-tasks-item-text \${task.completed ? 'is-done' : ''}\`}>
                    {task.label}
                  </p>
                  <div className="mui-tasks-item-meta">
                    <span>{task.category}</span>
                    <span>·</span>
                    <span className={task.priority === 'alta' ? 'is-high' : ''}>
                      Priorità {task.priority}
                    </span>
                  </div>
                </div>
              </label>

              <button
                type="button"
                aria-label={\`Elimina \${task.label}\`}
                onClick={() => handleDelete(task.id)}
                className="mui-tasks-del"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
`,
  css: `.mui-tasks {
  width: 100%;
  max-width: 520px;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-tasks-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mui-tasks-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.mui-tasks-sub {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.mui-tasks-count {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.mui-tasks-bar {
  margin-top: 14px;
  height: 6px;
  border-radius: 999px;
  background-color: #f1f5f9;
  overflow: hidden;
}

.mui-tasks-bar-fill {
  height: 100%;
  background-color: #2563eb;
  transition: width 0.2s ease;
}

.mui-tasks-form {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.mui-tasks-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.88rem;
  outline: none;
}

.mui-tasks-input:focus {
  border-color: #2563eb;
}

.mui-tasks-select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 8px 10px;
  font-size: 0.82rem;
  color: #334155;
  cursor: pointer;
}

.mui-tasks-add {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.mui-tasks-filters {
  margin-top: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mui-tasks-tabs {
  display: flex;
  gap: 4px;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}

.mui-tasks-tab {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
}

.mui-tasks-tab.is-active {
  background-color: #ffffff;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.mui-tasks-clear {
  background: transparent;
  border: none;
  font-size: 0.78rem;
  color: #64748b;
  cursor: pointer;
}

.mui-tasks-clear:hover {
  color: #0f172a;
}

.mui-tasks-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}

.mui-tasks-empty {
  padding: 28px 0;
  text-align: center;
  font-size: 0.84rem;
  color: #94a3b8;
}

.mui-tasks-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.mui-tasks-item:last-child {
  border-bottom: none;
}

.mui-tasks-check-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.mui-tasks-checkbox {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

.mui-tasks-item-text {
  margin: 0;
  font-size: 0.9rem;
  color: #1e293b;
}

.mui-tasks-item-text.is-done {
  text-decoration: line-through;
  color: #94a3b8;
}

.mui-tasks-item-meta {
  margin-top: 3px;
  display: flex;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.mui-tasks-item-meta .is-high {
  color: #b45309;
  font-weight: 600;
}

.mui-tasks-del {
  background: transparent;
  border: none;
  color: #cbd5e1;
  padding: 6px;
  cursor: pointer;
}

.mui-tasks-del:hover {
  color: #dc2626;
}
`,
};

export const FLASHCARD_PURE = {
  tsx: `import React, { useState } from 'react';

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
  onComplete?: (masteredCount: number, total: number) => void;
  className?: string;
}

export default function FlashcardDeck({
  title = 'Mazzo di studio',
  cards = [
    {
      id: 'fc-1',
      topic: 'Tipografia',
      front: "Cos'è la gerarchia tipografica?",
      back: "L'organizzazione di dimensioni, pesi e spaziature per guidare l'occhio attraverso i contenuti in ordine di importanza.",
    },
    {
      id: 'fc-2',
      topic: 'Architettura React',
      front: 'Quando usare uno stato locale rispetto alle props?',
      back: "Le props ricevono dati e callback dall'esterno; lo stato locale gestisce interazioni interne transitorie del componente.",
    },
    {
      id: 'fc-3',
      topic: 'Accessibilità',
      front: 'A cosa serve focus-visible?',
      back: "Mostra l'anello di messa a fuoco soltanto durante la navigazione da tastiera, evitando bordi superflui al clic del mouse.",
    },
    {
      id: 'fc-4',
      topic: 'Layout',
      front: 'Qual è il vantaggio di gap rispetto ai margini?',
      back: 'Gestisce la distanza esclusivamente tra elementi adiacenti, evitando accumuli indesiderati sui bordi esterni del contenitore.',
    },
  ],
  allowShuffle = true,
  onComplete,
  className = '',
}: FlashcardDeckProps) {
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
    <div className={\`mui-flash \${className}\`}>
      <div className="mui-flash-top">
        <div>
          <h3 className="mui-flash-title">{title}</h3>
          <p className="mui-flash-sub">
            Acquisite: {masteredCount} / {deck.length}
          </p>
        </div>
        <div className="mui-flash-right">
          {allowShuffle && (
            <button type="button" onClick={handleShuffle} className="mui-flash-shuffle">
              Mescola
            </button>
          )}
          <span className="mui-flash-idx">
            {index + 1}/{deck.length}
          </span>
        </div>
      </div>

      <div className="mui-flash-perspective">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={\`mui-flash-card \${flipped ? 'is-flipped' : ''}\`}
        >
          <div className="mui-flash-face is-front">
            <div className="mui-flash-face-top">
              <span>{current.topic || 'Scheda'}</span>
              <span>Fronte · Clicca per girare</span>
            </div>
            <p className="mui-flash-front-text">{current.front}</p>
            <div className="mui-flash-hint">Tocca la scheda per visualizzare la risposta</div>
          </div>

          <div className="mui-flash-face is-back">
            <div className="mui-flash-face-top">
              <span className="mui-flash-ans-label">Risposta</span>
              <span>Retro</span>
            </div>
            <p className="mui-flash-back-text">{current.back}</p>
            <div className="mui-flash-hint">Valuta la tua preparazione qui sotto</div>
          </div>
        </button>
      </div>

      <div className="mui-flash-actions">
        <button type="button" onClick={() => markCard(false)} className="mui-flash-btn-sec">
          Da rivedere
        </button>
        <button type="button" onClick={() => markCard(true)} className="mui-flash-btn-pri">
          Acquisita
        </button>
      </div>
    </div>
  );
}
`,
  css: `.mui-flash {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-flash-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mui-flash-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-flash-sub {
  margin: 3px 0 0;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-flash-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mui-flash-shuffle {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
}

.mui-flash-idx {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-flash-perspective {
  margin-top: 18px;
  perspective: 1000px;
}

.mui-flash-card {
  position: relative;
  display: block;
  width: 100%;
  min-height: 210px;
  padding: 0;
  border: none;
  background: transparent;
  transform-style: preserve-3d;
  transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.mui-flash-card.is-flipped {
  transform: rotateY(180deg);
}

.mui-flash-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mui-flash-face.is-front {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
}

.mui-flash-face.is-back {
  background-color: #ffffff;
  border: 2px solid #2563eb;
  transform: rotateY(180deg);
}

.mui-flash-face-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-flash-ans-label {
  color: #2563eb;
  font-weight: 700;
}

.mui-flash-front-text {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  line-height: 1.4;
}

.mui-flash-back-text {
  margin: 0;
  font-size: 0.96rem;
  color: #1e293b;
  text-align: center;
  line-height: 1.6;
}

.mui-flash-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
}

.mui-flash-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.mui-flash-btn-sec,
.mui-flash-btn-pri {
  flex: 1;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-flash-btn-sec {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.mui-flash-btn-pri {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
}
`,
};

export const FOCUS_TIMER_PURE = {
  tsx: `import React, { useEffect, useState } from 'react';

export interface FocusTimerCardProps {
  title?: string;
  workMinutes?: number;
  breakMinutes?: number;
  autoSwitch?: boolean;
  onSessionComplete?: (mode: 'work' | 'break', completedCount: number) => void;
  className?: string;
}

export default function FocusTimerCard({
  title = 'Timer di concentrazione',
  workMinutes = 25,
  breakMinutes = 5,
  autoSwitch = true,
  onSessionComplete,
  className = '',
}: FocusTimerCardProps) {
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
    <div className={\`mui-timer \${className}\`}>
      <div className="mui-timer-top">
        <h3 className="mui-timer-title">{title}</h3>
        <span className="mui-timer-cycles">Cicli: {sessions}</span>
      </div>

      <div className="mui-timer-modes">
        <button
          type="button"
          onClick={() => setMode('work')}
          className={\`mui-timer-mode \${mode === 'work' ? 'is-active' : ''}\`}
        >
          Lavoro ({workMinutes}m)
        </button>
        <button
          type="button"
          onClick={() => setMode('break')}
          className={\`mui-timer-mode \${mode === 'break' ? 'is-active' : ''}\`}
        >
          Pausa ({breakMinutes}m)
        </button>
      </div>

      <div className="mui-timer-ring">
        <svg className="mui-timer-svg" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={radius} className="mui-timer-track" />
          <circle
            cx="66"
            cy="66"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="mui-timer-fill"
          />
        </svg>
        <div className="mui-timer-readout">
          <span className="mui-timer-clock">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="mui-timer-state">
            {mode === 'work' ? 'Sessione attiva' : 'Intervallo pausa'}
          </span>
        </div>
      </div>

      <div className="mui-timer-actions">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="mui-timer-btn-pri"
        >
          {running ? 'Pausa' : 'Avvia'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(totalSeconds);
          }}
          className="mui-timer-btn-sec"
        >
          Azzera
        </button>
      </div>
    </div>
  );
}
`,
  css: `.mui-timer {
  width: 100%;
  max-width: 380px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-timer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mui-timer-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-timer-cycles {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-timer-modes {
  margin-top: 16px;
  display: inline-flex;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}

.mui-timer-mode {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
}

.mui-timer-mode.is-active {
  background-color: #ffffff;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.mui-timer-ring {
  position: relative;
  width: 148px;
  height: 148px;
  margin: 22px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mui-timer-svg {
  width: 148px;
  height: 148px;
  transform: rotate(-90deg);
}

.mui-timer-track {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 8;
}

.mui-timer-fill {
  fill: none;
  stroke: #2563eb;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.mui-timer-readout {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mui-timer-clock {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #0f172a;
}

.mui-timer-state {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 2px;
}

.mui-timer-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.mui-timer-btn-pri {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-timer-btn-sec {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}
`,
};

export const MINI_CALENDAR_PURE = {
  tsx: `import React, { useState } from 'react';

export interface CalendarEvent {
  date: string;
  label: string;
}

export interface MiniCalendarCardProps {
  title?: string;
  initialEvents?: CalendarEvent[];
  allowAddEvent?: boolean;
  onSelectDate?: (isoDate: string) => void;
  className?: string;
}

const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export default function MiniCalendarCard({
  title = 'Agenda mensile',
  initialEvents = [
    { date: '2026-11-13', label: 'Revisione struttura moduli' },
    { date: '2026-11-18', label: 'Consegna bozza documentazione' },
    { date: '2026-11-24', label: 'Sessione di verifica accessibilità' },
  ],
  allowAddEvent = true,
  onSelectDate,
  className = '',
}: MiniCalendarCardProps) {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10);
  const [selectedIso, setSelectedIso] = useState('2026-11-13');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [draftLabel, setDraftLabel] = useState('');

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7;
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
    <div className={\`mui-cal \${className}\`}>
      <div className="mui-cal-top">
        <div>
          {title && <p className="mui-cal-label">{title}</p>}
          <h3 className="mui-cal-title">
            {MONTHS_IT[viewMonth]} {viewYear}
          </h3>
        </div>
        <div className="mui-cal-arrows">
          <button type="button" onClick={prevMonth} aria-label="Mese precedente" className="mui-cal-arrow">
            ‹
          </button>
          <button type="button" onClick={nextMonth} aria-label="Mese successivo" className="mui-cal-arrow">
            ›
          </button>
        </div>
      </div>

      <div className="mui-cal-grid">
        {DAYS_IT.map((d) => (
          <div key={d} className="mui-cal-weekday">
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
              className={\`mui-cal-day \${isSelected ? 'is-selected' : ''}\`}
            >
              <span>{day}</span>
              {hasEvent && <span className="mui-cal-dot" />}
            </button>
          );
        })}
      </div>

      <div className="mui-cal-events">
        <div className="mui-cal-events-head">
          <span>{selectedIso}</span>
          <span>{selectedEvents.length} eventi</span>
        </div>

        <ul className="mui-cal-events-list">
          {selectedEvents.length === 0 ? (
            <li className="mui-cal-empty">Nessun appunto per questa data.</li>
          ) : (
            selectedEvents.map((ev, idx) => (
              <li key={idx} className="mui-cal-event-item">
                {ev.label}
              </li>
            ))
          )}
        </ul>

        {allowAddEvent && (
          <form onSubmit={handleAddEvent} className="mui-cal-form">
            <input
              type="text"
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              placeholder="Aggiungi nota al giorno..."
              className="mui-cal-input"
            />
            <button type="submit" className="mui-cal-save">
              Salva
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
`,
  css: `.mui-cal {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-cal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mui-cal-label {
  margin: 0;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-cal-title {
  margin: 2px 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-cal-arrows {
  display: flex;
  gap: 6px;
}

.mui-cal-arrow {
  width: 30px;
  height: 30px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #334155;
  cursor: pointer;
}

.mui-cal-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.mui-cal-weekday {
  padding: 4px 0;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
}

.mui-cal-day {
  position: relative;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  color: #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mui-cal-day:hover {
  background-color: #f1f5f9;
}

.mui-cal-day.is-selected {
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
}

.mui-cal-dot {
  margin-top: 2px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background-color: #2563eb;
}

.mui-cal-day.is-selected .mui-cal-dot {
  background-color: #ffffff;
}

.mui-cal-events {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.mui-cal-events-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.mui-cal-events-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mui-cal-empty {
  font-size: 0.8rem;
  color: #94a3b8;
}

.mui-cal-event-item {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.82rem;
  color: #1e293b;
}

.mui-cal-form {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.mui-cal-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.82rem;
  outline: none;
}

.mui-cal-save {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
`,
};

export const MINI_KANBAN_PURE = {
  tsx: `import React, { useState } from 'react';

export interface KanbanCardItem {
  id: string;
  title: string;
  column: 'todo' | 'doing' | 'done';
}

export interface MiniKanbanCardProps {
  title?: string;
  initialCards?: KanbanCardItem[];
  allowAdd?: boolean;
  onCardsChange?: (cards: KanbanCardItem[]) => void;
  className?: string;
}

const COLUMNS: { id: KanbanCardItem['column']; label: string }[] = [
  { id: 'todo', label: 'Da fare' },
  { id: 'doing', label: 'In corso' },
  { id: 'done', label: 'Completato' },
];

export default function MiniKanbanCard({
  title = 'Bacheca attività',
  initialCards = [
    { id: 'k1', title: 'Definire schema props', column: 'done' },
    { id: 'k2', title: 'Rifinire spaziatura mobile', column: 'doing' },
    { id: 'k3', title: 'Scrivere note di utilizzo', column: 'todo' },
    { id: 'k4', title: 'Verificare contrasto testi', column: 'todo' },
  ],
  allowAdd = true,
  onCardsChange,
  className = '',
}: MiniKanbanCardProps) {
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
    <div className={\`mui-kanban \${className}\`}>
      <div className="mui-kanban-top">
        <h3 className="mui-kanban-title">{title}</h3>
        {allowAdd && (
          <form onSubmit={addCard} className="mui-kanban-form">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nuova scheda..."
              className="mui-kanban-input"
            />
            <button type="submit" className="mui-kanban-add">
              Aggiungi
            </button>
          </form>
        )}
      </div>

      <div className="mui-kanban-cols">
        {COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div key={col.id} className="mui-kanban-col">
              <div className="mui-kanban-col-head">
                <span>{col.label}</span>
                <span className="mui-kanban-col-count">{colCards.length}</span>
              </div>

              <div className="mui-kanban-cards">
                {colCards.map((card) => (
                  <div key={card.id} className="mui-kanban-card">
                    <p className="mui-kanban-card-title">{card.title}</p>
                    <div className="mui-kanban-card-foot">
                      <div className="mui-kanban-moves">
                        <button
                          type="button"
                          disabled={colIdx === 0}
                          onClick={() => moveCard(card.id, -1)}
                          aria-label="Sposta a sinistra"
                          className="mui-kanban-move"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={colIdx === COLUMNS.length - 1}
                          onClick={() => moveCard(card.id, 1)}
                          aria-label="Sposta a destra"
                          className="mui-kanban-move"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCard(card.id)}
                        aria-label="Elimina scheda"
                        className="mui-kanban-del"
                      >
                        ✕
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
`,
  css: `.mui-kanban {
  width: 100%;
  max-width: 720px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-kanban-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.mui-kanban-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-kanban-form {
  display: flex;
  gap: 8px;
}

.mui-kanban-input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.82rem;
  outline: none;
}

.mui-kanban-add {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-kanban-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mui-kanban-col {
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 12px;
}

.mui-kanban-col-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 10px;
}

.mui-kanban-col-count {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #94a3b8;
}

.mui-kanban-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mui-kanban-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
}

.mui-kanban-card-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
}

.mui-kanban-card-foot {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mui-kanban-moves {
  display: flex;
  gap: 4px;
}

.mui-kanban-move {
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  color: #475569;
  cursor: pointer;
}

.mui-kanban-move:hover:not(:disabled) {
  background-color: #f1f5f9;
}

.mui-kanban-move:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mui-kanban-del {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

.mui-kanban-del:hover {
  color: #dc2626;
}

@media (max-width: 680px) {
  .mui-kanban-cols {
    grid-template-columns: 1fr;
  }
}
`,
};
