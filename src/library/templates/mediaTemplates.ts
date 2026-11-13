export const CARD_BASE_TEMPLATE = `import React, { useState } from 'react';

export interface ContentCardProps {
  kicker?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  metaItems?: string[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  layout?: 'vertical' | 'horizontal' | 'compact';
  elevation?: 'flat' | 'soft';
  showImage?: boolean;
  accentColor?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_PROPS: ContentCardProps = {
  kicker: "Saggio visivo",
  title: "Equilibrio delle forme negli spazi contemporanei",
  description: "Un modulo informativo generico adattabile a schede articolo, archivi editoriali, raccolte tematiche o elenchi di risorse strutturate.",
  imageUrl: "/src/assets/images/minimal_studio_landscape_1794593556848.jpg",
  imageAlt: "Orizzonte alpino minimalista immerso nella nebbia mattutina",
  metaItems: ["Architettura", "6 min di lettura", "Novembre 2026"],
  primaryActionLabel: "Apri scheda",
  secondaryActionLabel: "Salva",
  layout: "vertical",
  elevation: "soft",
  showImage: true,
  accentColor: "#2563eb"
};

export default function ContentCard(props: ContentCardProps) {
  const {
    kicker = DEFAULT_PROPS.kicker,
    title = DEFAULT_PROPS.title,
    description = DEFAULT_PROPS.description,
    imageUrl = DEFAULT_PROPS.imageUrl,
    imageAlt = DEFAULT_PROPS.imageAlt,
    metaItems = DEFAULT_PROPS.metaItems ?? [],
    primaryActionLabel = DEFAULT_PROPS.primaryActionLabel,
    secondaryActionLabel = DEFAULT_PROPS.secondaryActionLabel,
    layout = DEFAULT_PROPS.layout,
    elevation = DEFAULT_PROPS.elevation,
    showImage = DEFAULT_PROPS.showImage,
    accentColor = DEFAULT_PROPS.accentColor,
    onPrimaryAction,
    onSecondaryAction,
    className = '',
    children,
  } = props;

  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);

  const isHorizontal = layout === 'horizontal';
  const isCompact = layout === 'compact';

  const cardSurface =
    elevation === 'soft'
      ? 'bg-white shadow-sm border border-slate-200/80'
      : 'bg-white border border-slate-200';

  const handleSecondary = () => {
    setSaved((prev) => !prev);
    onSecondaryAction?.();
  };

  return (
    <article
      className={\`overflow-hidden rounded-xl transition-shadow hover:shadow-md \${cardSurface} \${
        isHorizontal
          ? 'flex flex-col sm:flex-row max-w-2xl w-full'
          : 'flex flex-col max-w-md w-full'
      } \${className}\`}
    >
      {showImage && !isCompact && (
        <div
          className={\`relative overflow-hidden bg-slate-100 shrink-0 \${
            isHorizontal ? 'sm:w-56 h-48 sm:h-auto' : 'aspect-[4/3] w-full'
          }\`}
        >
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4">
              <span className="text-xs font-medium">{imageAlt || 'Immagine'}</span>
            </div>
          )}
        </div>
      )}

      <div className={\`flex flex-1 flex-col justify-between \${isCompact ? 'p-5' : 'p-6'}\`}>
        <div>
          {kicker && (
            <p
              style={{ color: accentColor }}
              className="text-xs font-semibold tracking-wide mb-1.5"
            >
              {kicker}
            </p>
          )}

          <h3 className="text-lg font-semibold text-slate-900 leading-snug text-balance">
            {title}
          </h3>

          {metaItems.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              {metaItems.map((item, idx) => (
                <React.Fragment key={\`\${item}-\${idx}\`}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {description && !isCompact && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {primaryActionLabel ? (
              <button
                type="button"
                onClick={onPrimaryAction}
                style={{ backgroundColor: accentColor }}
                className="rounded-lg px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
              >
                {primaryActionLabel}
              </button>
            ) : (
              <span />
            )}

            {secondaryActionLabel && (
              <button
                type="button"
                onClick={handleSecondary}
                className={\`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer \${
                  saved
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }\`}
              >
                {saved ? 'Salvato' : secondaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
`;

export const VIDEO_PLAYER_TEMPLATE = `import React, { useEffect, useRef, useState } from 'react';

export interface VideoChapter {
  time: number;
  label: string;
}

export interface VideoPlayerCardProps {
  title?: string;
  author?: string;
  src?: string;
  posterUrl?: string;
  durationSeconds?: number;
  chapters?: VideoChapter[];
  showChapters?: boolean;
  allowSpeedControl?: boolean;
  accentColor?: string;
  className?: string;
}

export const DEFAULT_PROPS: VideoPlayerCardProps = {
  title: "Studio sulla luce naturale e geometria",
  author: "Archivio Visivo · Modulo 04",
  src: "",
  posterUrl: "/src/assets/images/minimal_studio_landscape_1794593556848.jpg",
  durationSeconds: 90,
  chapters: [
    { time: 0, label: "Introduzione" },
    { time: 28, label: "Proporzioni" },
    { time: 62, label: "Sequenza finale" }
  ],
  showChapters: true,
  allowSpeedControl: true,
  accentColor: "#2563eb"
};

function formatTime(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return \`\${m}:\${s.toString().padStart(2, '0')}\`;
}

export default function VideoPlayerCard(props: VideoPlayerCardProps) {
  const {
    title = DEFAULT_PROPS.title,
    author = DEFAULT_PROPS.author,
    src = DEFAULT_PROPS.src,
    posterUrl = DEFAULT_PROPS.posterUrl,
    durationSeconds = DEFAULT_PROPS.durationSeconds ?? 90,
    chapters = DEFAULT_PROPS.chapters ?? [],
    showChapters = DEFAULT_PROPS.showChapters,
    allowSpeedControl = DEFAULT_PROPS.allowSpeedControl,
    accentColor = DEFAULT_PROPS.accentColor,
    className = '',
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const hasExternalVideo = Boolean(src && src.trim().length > 0);

  useEffect(() => {
    if (!hasExternalVideo) {
      setDuration(durationSeconds);
    }
  }, [durationSeconds, hasExternalVideo]);

  // Procedural canvas video stream fallback when no external video src is provided
  useEffect(() => {
    if (hasExternalVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural wave lines
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const yBase = h * (0.35 + i * 0.08);
        for (let x = 0; x <= w; x += 12) {
          const wave = Math.sin(x * 0.012 + t * 1.3 + i * 0.7) * (14 + i * 3);
          if (x === 0) ctx.moveTo(x, yBase + wave);
          else ctx.lineTo(x, yBase + wave);
        }
        ctx.strokeStyle = i === 2 ? accentColor || '#2563eb' : 'rgba(226, 232, 240, 0.22)';
        ctx.lineWidth = i === 2 ? 2.5 : 1.2;
        ctx.stroke();
      }

      // Horizon focus circle
      const cx = w * 0.5 + Math.cos(t * 0.45) * 48;
      const cy = h * 0.42 + Math.sin(t * 0.6) * 16;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    drawFrame(currentTime);
  }, [hasExternalVideo, currentTime, accentColor]);

  useEffect(() => {
    if (hasExternalVideo || !isPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1 * playbackRate;
        if (next >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [hasExternalVideo, isPlaying, playbackRate, duration]);

  const togglePlay = () => {
    if (hasExternalVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const seekTo = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    setCurrentTime(clamped);
    if (hasExternalVideo && videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const cycleSpeed = () => {
    const rates = [1, 1.25, 1.5, 2, 0.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (hasExternalVideo && videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (hasExternalVideo && videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setMuted(val === 0);
    if (hasExternalVideo && videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={\`w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm \${className}\`}
    >
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
        {hasExternalVideo ? (
          <video
            ref={videoRef}
            src={src}
            poster={posterUrl}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current && isFinite(videoRef.current.duration)) {
                setDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="h-full w-full object-cover cursor-pointer"
          />
        ) : (
          <div className="relative h-full w-full cursor-pointer" onClick={togglePlay}>
            <canvas
              ref={canvasRef}
              width={720}
              height={405}
              className="h-full w-full object-cover"
            />
            {!isPlaying && currentTime === 0 && posterUrl && (
              <img
                src={posterUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity transition-opacity"
              />
            )}
          </div>
        )}

        {!isPlaying && (
          <button
            type="button"
            aria-label="Riproduci video"
            onClick={togglePlay}
            style={{ backgroundColor: accentColor }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900 px-4 py-3 text-slate-100">
        <div className="relative mb-2.5 flex items-center">
          <input
            type="range"
            aria-label="Avanzamento video"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            style={{ accentColor }}
            className="w-full h-1.5 cursor-pointer rounded-lg bg-slate-700"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>

            <span className="text-xs font-mono tabular-nums text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="hidden sm:flex items-center gap-2 ml-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Attiva audio' : 'Silenzia'}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                {muted || volume === 0 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <line x1="22" x2="16" y1="9" y2="15" />
                    <line x1="16" x2="22" y1="9" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                aria-label="Volume"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{ accentColor }}
                className="w-16 h-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allowSpeedControl && (
              <button
                type="button"
                onClick={cycleSpeed}
                className="rounded px-2 py-1 text-xs font-mono tabular-nums text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                {playbackRate}x
              </button>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Schermo intero"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Metadata & Chapters */}
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {author && <p className="mt-0.5 text-xs text-slate-500">{author}</p>}
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {Math.round(progressPct)}% completato
          </span>
        </div>

        {showChapters && chapters.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {chapters.map((chap, idx) => {
              const nextChap = chapters[idx + 1];
              const isCurrent =
                currentTime >= chap.time &&
                (!nextChap || currentTime < nextChap.time);
              return (
                <button
                  key={\`\${chap.label}-\${idx}\`}
                  type="button"
                  onClick={() => seekTo(chap.time)}
                  style={
                    isCurrent
                      ? { borderColor: accentColor, color: accentColor }
                      : undefined
                  }
                  className={\`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer \${
                    isCurrent
                      ? 'bg-slate-50 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }\`}
                >
                  <span className="font-mono tabular-nums text-[11px] opacity-75">
                    {formatTime(chap.time)}
                  </span>
                  <span>{chap.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
`;

export const AUDIO_PLAYER_TEMPLATE = `import React, { useEffect, useRef, useState } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src?: string;
  coverUrl?: string;
}

export interface AudioPlayerCardProps {
  tracks?: AudioTrack[];
  showPlaylist?: boolean;
  showWaveform?: boolean;
  variant?: 'card' | 'compact';
  accentColor?: string;
  onTrackChange?: (track: AudioTrack) => void;
  className?: string;
}

export const DEFAULT_PROPS: AudioPlayerCardProps = {
  tracks: [
    {
      id: "traccia-1",
      title: "Studio Acustico I",
      artist: "Raccolta Strumentale",
      duration: 75,
      coverUrl: "/src/assets/images/geometric_sound_cover_1794593556961.jpg"
    },
    {
      id: "traccia-2",
      title: "Notturno in Re Minore",
      artist: "Raccolta Strumentale",
      duration: 92,
      coverUrl: "/src/assets/images/geometric_sound_cover_1794593556961.jpg"
    },
    {
      id: "traccia-3",
      title: "Frequenze Ambientali",
      artist: "Archivio Sonoro",
      duration: 64,
      coverUrl: "/src/assets/images/geometric_sound_cover_1794593556961.jpg"
    }
  ],
  showPlaylist: true,
  showWaveform: true,
  variant: "card",
  accentColor: "#2563eb"
};

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const min = Math.floor(s / 60);
  const rem = s % 60;
  return \`\${min}:\${rem.toString().padStart(2, '0')}\`;
}

export default function AudioPlayerCard(props: AudioPlayerCardProps) {
  const {
    tracks = DEFAULT_PROPS.tracks ?? [],
    showPlaylist = DEFAULT_PROPS.showPlaylist,
    showWaveform = DEFAULT_PROPS.showWaveform,
    variant = DEFAULT_PROPS.variant,
    accentColor = DEFAULT_PROPS.accentColor,
    onTrackChange,
    className = '',
  } = props;

  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [repeat, setRepeat] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);

  const currentTrack = tracks[trackIdx] || tracks[0];
  const hasRealSrc = Boolean(currentTrack?.src && currentTrack.src.trim().length > 0);
  const duration = currentTrack?.duration || 60;

  const stopSynth = () => {
    oscNodesRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    oscNodesRef.current = [];
  };

  const startSynth = () => {
    stopSynth();
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const gain = ctx.createGain();
      gain.gain.value = volume * 0.08;
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      const baseFreqs = trackIdx % 2 === 0 ? [220, 277.18, 329.63] : [196, 246.94, 293.66];
      oscNodesRef.current = baseFreqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start();
        return osc;
      });
    } catch {
      // AudioContext unavailable in restricted environments
    }
  };

  useEffect(() => {
    return () => stopSynth();
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume * 0.08;
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || hasRealSrc) return;
    const timer = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 0.25 >= duration) {
          if (repeat) return 0;
          if (trackIdx < tracks.length - 1) {
            const next = trackIdx + 1;
            setTrackIdx(next);
            onTrackChange?.(tracks[next]);
            return 0;
          }
          setIsPlaying(false);
          stopSynth();
          return 0;
        }
        return prev + 0.25;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, [isPlaying, hasRealSrc, duration, repeat, trackIdx, tracks, onTrackChange]);

  const selectTrack = (idx: number) => {
    setTrackIdx(idx);
    setElapsed(0);
    setCoverError(false);
    onTrackChange?.(tracks[idx]);
    if (isPlaying && !tracks[idx]?.src) {
      startSynth();
    }
  };

  const togglePlay = () => {
    if (hasRealSrc && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    if (isPlaying) {
      stopSynth();
      setIsPlaying(false);
    } else {
      startSynth();
      setIsPlaying(true);
    }
  };

  const bars = [35, 62, 48, 84, 52, 92, 68, 44, 76, 58, 88, 42, 70, 50, 64, 38, 78, 56, 46, 66];

  if (!currentTrack) return null;

  return (
    <div
      className={\`w-full \${
        variant === 'compact' ? 'max-w-md' : 'max-w-lg'
      } rounded-xl border border-slate-200 bg-white p-5 shadow-sm \${className}\`}
    >
      {hasRealSrc && (
        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={() => {
            if (audioRef.current) setElapsed(audioRef.current.currentTime);
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {currentTrack.coverUrl && !coverError ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              onError={() => setCoverError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
          style={{ backgroundColor: accentColor }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="7 4 20 12 7 20 7 4" />
            </svg>
          )}
        </button>
      </div>

      {/* Waveform / Progress */}
      <div className="mt-5">
        {showWaveform && variant !== 'compact' && (
          <div className="mb-2.5 flex h-9 items-end justify-between gap-1" aria-hidden="true">
            {bars.map((height, idx) => {
              const barPct = ((idx + 1) / bars.length) * 100;
              const activePct = (elapsed / duration) * 100;
              const isPast = barPct <= activePct;
              const animatedHeight = isPlaying
                ? Math.max(20, ((height + Math.round(elapsed * 20 + idx * 13)) % 85) + 15)
                : height;
              return (
                <div
                  key={idx}
                  style={{
                    height: \`\${animatedHeight}%\`,
                    backgroundColor: isPast ? accentColor : '#cbd5e1',
                  }}
                  className="flex-1 rounded-sm transition-all duration-150"
                />
              );
            })}
          </div>
        )}

        <input
          type="range"
          aria-label="Posizione traccia"
          min={0}
          max={duration}
          step={0.5}
          value={elapsed}
          onChange={(e) => {
            const val = Number(e.target.value);
            setElapsed(val);
            if (audioRef.current) audioRef.current.currentTime = val;
          }}
          style={{ accentColor }}
          className="w-full h-1.5 cursor-pointer"
        />

        <div className="mt-1.5 flex items-center justify-between text-xs font-mono tabular-nums text-slate-500">
          <span>{formatClock(elapsed)}</span>
          <span>{formatClock(duration)}</span>
        </div>
      </div>

      {/* Transport & Volume */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectTrack((trackIdx - 1 + tracks.length) % tracks.length)}
            aria-label="Traccia precedente"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" x2="5" y1="19" y2="5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => selectTrack((trackIdx + 1) % tracks.length)}
            aria-label="Traccia successiva"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" x2="19" y1="5" y2="19" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setRepeat((r) => !r)}
            aria-label="Ripeti traccia"
            style={repeat ? { color: accentColor } : undefined}
            className={\`rounded-lg p-1.5 transition-colors cursor-pointer \${
              repeat ? 'bg-slate-100' : 'text-slate-500 hover:bg-slate-100'
            }\`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m17 2 4 4-4 4" />
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <svg className="text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <input
            type="range"
            aria-label="Volume audio"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ accentColor }}
            className="w-20 h-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && variant !== 'compact' && (
        <ul className="mt-4 space-y-1 border-t border-slate-100 pt-3">
          {tracks.map((tr, idx) => {
            const active = idx === trackIdx;
            return (
              <li key={tr.id}>
                <button
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={\`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer \${
                    active
                      ? 'bg-slate-100 font-semibold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }\`}
                >
                  <span className="truncate pr-3">
                    <span className="font-mono tabular-nums text-slate-400 mr-2">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {tr.title}
                  </span>
                  <span className="font-mono tabular-nums text-slate-400 shrink-0">
                    {formatClock(tr.duration)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
`;
