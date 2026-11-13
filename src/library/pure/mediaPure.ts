export const CARD_BASE_PURE = {
  tsx: `import React, { useState } from 'react';

export interface ContentCardProps {
  kicker?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  metaItems?: string[];
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function ContentCard({
  kicker = 'Saggio visivo',
  title = 'Equilibrio delle forme negli spazi contemporanei',
  description = 'Un modulo informativo generico adattabile a schede articolo, archivi editoriali, raccolte tematiche o elenchi di risorse strutturate.',
  imageUrl = '/src/assets/images/minimal_studio_landscape_1794593556848.jpg',
  imageAlt = 'Orizzonte alpino minimalista immerso nella nebbia mattutina',
  metaItems = ['Architettura', '6 min di lettura', 'Novembre 2026'],
  primaryLabel = 'Apri scheda',
  secondaryLabel = 'Salva',
  onPrimaryClick,
  onSecondaryClick,
  className = '',
  children,
}: ContentCardProps) {
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSecondary = () => {
    setSaved((prev) => !prev);
    onSecondaryClick?.();
  };

  return (
    <article className={\`mui-card \${className}\`}>
      {imageUrl && (
        <div className="mui-card-media">
          {!imgError ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="mui-card-img"
            />
          ) : (
            <div className="mui-card-fallback">
              <span>{imageAlt || 'Immagine'}</span>
            </div>
          )}
        </div>
      )}

      <div className="mui-card-body">
        <div>
          {kicker && <p className="mui-card-kicker">{kicker}</p>}
          <h3 className="mui-card-title">{title}</h3>

          {metaItems.length > 0 && (
            <div className="mui-card-meta">
              {metaItems.map((item, idx) => (
                <React.Fragment key={\`\${item}-\${idx}\`}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {description && <p className="mui-card-desc">{description}</p>}
          {children && <div className="mui-card-slot">{children}</div>}
        </div>

        {(primaryLabel || secondaryLabel) && (
          <div className="mui-card-footer">
            {primaryLabel ? (
              <button
                type="button"
                onClick={onPrimaryClick}
                className="mui-card-btn-primary"
              >
                {primaryLabel}
              </button>
            ) : (
              <span />
            )}

            {secondaryLabel && (
              <button
                type="button"
                onClick={handleSecondary}
                className={\`mui-card-btn-secondary \${saved ? 'is-saved' : ''}\`}
              >
                {saved ? 'Salvato' : secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
`,
  css: `.mui-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-card:hover {
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.mui-card-media {
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: #f1f5f9;
  overflow: hidden;
}

.mui-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mui-card-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.85rem;
  padding: 16px;
}

.mui-card-body {
  padding: 22px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}

.mui-card-kicker {
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 0.02em;
}

.mui-card-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  color: #0f172a;
}

.mui-card-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #64748b;
}

.mui-card-desc {
  margin: 12px 0 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #475569;
}

.mui-card-slot {
  margin-top: 14px;
}

.mui-card-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mui-card-btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.mui-card-btn-primary:hover {
  background-color: #1d4ed8;
}

.mui-card-btn-secondary {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-card-btn-secondary:hover {
  background-color: #f8fafc;
}

.mui-card-btn-secondary.is-saved {
  background-color: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}
`,
};

export const VIDEO_PLAYER_PURE = {
  tsx: `import React, { useEffect, useRef, useState } from 'react';

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
  className?: string;
}

function formatTime(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return \`\${m}:\${s.toString().padStart(2, '0')}\`;
}

export default function VideoPlayerCard({
  title = 'Studio sulla luce naturale e geometria',
  author = 'Archivio Visivo · Modulo 04',
  src = '',
  posterUrl = '/src/assets/images/minimal_studio_landscape_1794593556848.jpg',
  durationSeconds = 90,
  chapters = [
    { time: 0, label: 'Introduzione' },
    { time: 28, label: 'Proporzioni' },
    { time: 62, label: 'Sequenza finale' },
  ],
  showChapters = true,
  allowSpeedControl = true,
  className = '',
}: VideoPlayerCardProps) {
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

  useEffect(() => {
    if (hasExternalVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const yBase = h * (0.35 + i * 0.08);
      for (let x = 0; x <= w; x += 12) {
        const wave = Math.sin(x * 0.012 + currentTime * 1.3 + i * 0.7) * (14 + i * 3);
        if (x === 0) ctx.moveTo(x, yBase + wave);
        else ctx.lineTo(x, yBase + wave);
      }
      ctx.strokeStyle = i === 2 ? '#3b82f6' : 'rgba(226, 232, 240, 0.22)';
      ctx.lineWidth = i === 2 ? 2.5 : 1.2;
      ctx.stroke();
    }

    const cx = w * 0.5 + Math.cos(currentTime * 0.45) * 48;
    const cy = h * 0.42 + Math.sin(currentTime * 0.6) * 16;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [hasExternalVideo, currentTime]);

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

  const progressPct = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

  return (
    <div ref={containerRef} className={\`mui-video \${className}\`}>
      <div className="mui-video-stage">
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
            className="mui-video-media"
          />
        ) : (
          <div className="mui-video-canvas-wrap" onClick={togglePlay}>
            <canvas
              ref={canvasRef}
              width={720}
              height={405}
              className="mui-video-media"
            />
            {!isPlaying && currentTime === 0 && posterUrl && (
              <img
                src={posterUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="mui-video-poster"
              />
            )}
          </div>
        )}

        {!isPlaying && (
          <button
            type="button"
            aria-label="Riproduci video"
            onClick={togglePlay}
            className="mui-video-play-overlay"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </button>
        )}
      </div>

      <div className="mui-video-controls">
        <input
          type="range"
          aria-label="Avanzamento video"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="mui-video-seek"
        />

        <div className="mui-video-bar">
          <div className="mui-video-bar-left">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
              className="mui-video-icon-btn"
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

            <span className="mui-video-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="mui-video-volume">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Attiva audio' : 'Silenzia'}
                className="mui-video-icon-btn"
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
                className="mui-video-vol-slider"
              />
            </div>
          </div>

          <div className="mui-video-bar-right">
            {allowSpeedControl && (
              <button type="button" onClick={cycleSpeed} className="mui-video-speed">
                {playbackRate}x
              </button>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Schermo intero"
              className="mui-video-icon-btn"
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

      <div className="mui-video-meta">
        <div className="mui-video-meta-top">
          <div>
            <h3 className="mui-video-title">{title}</h3>
            {author && <p className="mui-video-author">{author}</p>}
          </div>
          <span className="mui-video-pct">{progressPct}% completato</span>
        </div>

        {showChapters && chapters.length > 0 && (
          <div className="mui-video-chapters">
            {chapters.map((chap, idx) => {
              const nextChap = chapters[idx + 1];
              const isCurrent =
                currentTime >= chap.time && (!nextChap || currentTime < nextChap.time);
              return (
                <button
                  key={\`\${chap.label}-\${idx}\`}
                  type="button"
                  onClick={() => seekTo(chap.time)}
                  className={\`mui-video-chapter \${isCurrent ? 'is-current' : ''}\`}
                >
                  <span className="mui-video-chapter-time">{formatTime(chap.time)}</span>
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
`,
  css: `.mui-video {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-video-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  background-color: #0f172a;
  overflow: hidden;
}

.mui-video-canvas-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.mui-video-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.mui-video-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
}

.mui-video-play-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: none;
  background-color: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s ease;
}

.mui-video-play-overlay:hover {
  transform: translate(-50%, -50%) scale(1.06);
}

.mui-video-controls {
  background-color: #0f172a;
  color: #f1f5f9;
  padding: 12px 16px;
}

.mui-video-seek {
  width: 100%;
  height: 6px;
  accent-color: #3b82f6;
  cursor: pointer;
  margin-bottom: 10px;
}

.mui-video-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mui-video-bar-left,
.mui-video-bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mui-video-icon-btn {
  background: transparent;
  border: none;
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mui-video-icon-btn:hover {
  background-color: #1e293b;
  color: #ffffff;
}

.mui-video-time {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: #cbd5e1;
}

.mui-video-volume {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mui-video-vol-slider {
  width: 68px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.mui-video-speed {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.mui-video-speed:hover {
  background-color: #1e293b;
  color: #ffffff;
}

.mui-video-meta {
  padding: 18px 20px;
}

.mui-video-meta-top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.mui-video-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-video-author {
  margin: 3px 0 0;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-video-pct {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.mui-video-chapters {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mui-video-chapter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: #475569;
  cursor: pointer;
}

.mui-video-chapter:hover {
  background-color: #f8fafc;
}

.mui-video-chapter.is-current {
  border-color: #2563eb;
  color: #1d4ed8;
  background-color: #eff6ff;
  font-weight: 600;
}

.mui-video-chapter-time {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.72rem;
  opacity: 0.75;
}

@media (max-width: 520px) {
  .mui-video-volume {
    display: none;
  }
}
`,
};

export const AUDIO_PLAYER_PURE = {
  tsx: `import React, { useEffect, useRef, useState } from 'react';

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
  onTrackChange?: (track: AudioTrack) => void;
  className?: string;
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const min = Math.floor(s / 60);
  const rem = s % 60;
  return \`\${min}:\${rem.toString().padStart(2, '0')}\`;
}

export default function AudioPlayerCard({
  tracks = [
    {
      id: 'traccia-1',
      title: 'Studio Acustico I',
      artist: 'Raccolta Strumentale',
      duration: 75,
      coverUrl: '/src/assets/images/geometric_sound_cover_1794593556961.jpg',
    },
    {
      id: 'traccia-2',
      title: 'Notturno in Re Minore',
      artist: 'Raccolta Strumentale',
      duration: 92,
      coverUrl: '/src/assets/images/geometric_sound_cover_1794593556961.jpg',
    },
    {
      id: 'traccia-3',
      title: 'Frequenze Ambientali',
      artist: 'Archivio Sonoro',
      duration: 64,
      coverUrl: '/src/assets/images/geometric_sound_cover_1794593556961.jpg',
    },
  ],
  showPlaylist = true,
  showWaveform = true,
  onTrackChange,
  className = '',
}: AudioPlayerCardProps) {
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
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      // AudioContext unavailable
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
    <div className={\`mui-audio \${className}\`}>
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

      <div className="mui-audio-header">
        <div className="mui-audio-cover">
          {currentTrack.coverUrl && !coverError ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              onError={() => setCoverError(true)}
            />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </div>

        <div className="mui-audio-info">
          <h3 className="mui-audio-title">{currentTrack.title}</h3>
          <p className="mui-audio-artist">{currentTrack.artist}</p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
          className="mui-audio-play"
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

      <div className="mui-audio-progress-wrap">
        {showWaveform && (
          <div className="mui-audio-wave" aria-hidden="true">
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
                  style={{ height: \`\${animatedHeight}%\` }}
                  className={\`mui-audio-bar \${isPast ? 'is-active' : ''}\`}
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
          className="mui-audio-seek"
        />

        <div className="mui-audio-clocks">
          <span>{formatClock(elapsed)}</span>
          <span>{formatClock(duration)}</span>
        </div>
      </div>

      <div className="mui-audio-transport">
        <div className="mui-audio-btns">
          <button
            type="button"
            onClick={() => selectTrack((trackIdx - 1 + tracks.length) % tracks.length)}
            aria-label="Traccia precedente"
            className="mui-audio-ctrl"
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
            className="mui-audio-ctrl"
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
            className={\`mui-audio-ctrl \${repeat ? 'is-repeat' : ''}\`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m17 2 4 4-4 4" />
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className="mui-audio-vol">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="mui-audio-vol-range"
          />
        </div>
      </div>

      {showPlaylist && tracks.length > 1 && (
        <ul className="mui-audio-playlist">
          {tracks.map((tr, idx) => {
            const active = idx === trackIdx;
            return (
              <li key={tr.id}>
                <button
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={\`mui-audio-track \${active ? 'is-active' : ''}\`}
                >
                  <span className="mui-audio-track-name">
                    <span className="mui-audio-track-num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {tr.title}
                  </span>
                  <span className="mui-audio-track-dur">{formatClock(tr.duration)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
`,
  css: `.mui-audio {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-audio-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mui-audio-cover {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background-color: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mui-audio-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mui-audio-info {
  flex: 1;
  min-width: 0;
}

.mui-audio-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mui-audio-artist {
  margin: 3px 0 0;
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mui-audio-play {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 999px;
  border: none;
  background-color: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mui-audio-play:hover {
  background-color: #1d4ed8;
}

.mui-audio-progress-wrap {
  margin-top: 18px;
}

.mui-audio-wave {
  height: 36px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 10px;
}

.mui-audio-bar {
  flex: 1;
  border-radius: 3px;
  background-color: #cbd5e1;
  transition: height 0.15s ease, background-color 0.15s ease;
}

.mui-audio-bar.is-active {
  background-color: #2563eb;
}

.mui-audio-seek {
  width: 100%;
  height: 6px;
  accent-color: #2563eb;
  cursor: pointer;
}

.mui-audio-clocks {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.mui-audio-transport {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mui-audio-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mui-audio-ctrl {
  background: transparent;
  border: none;
  color: #475569;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
}

.mui-audio-ctrl:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.mui-audio-ctrl.is-repeat {
  background-color: #eff6ff;
  color: #2563eb;
}

.mui-audio-vol {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
}

.mui-audio-vol-range {
  width: 78px;
  accent-color: #2563eb;
  cursor: pointer;
}

.mui-audio-playlist {
  list-style: none;
  margin: 14px 0 0;
  padding: 12px 0 0;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mui-audio-track {
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 0.82rem;
  color: #475569;
  cursor: pointer;
}

.mui-audio-track:hover {
  background-color: #f8fafc;
}

.mui-audio-track.is-active {
  background-color: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
}

.mui-audio-track-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 12px;
}

.mui-audio-track-num {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #94a3b8;
  margin-right: 8px;
}

.mui-audio-track-dur {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  color: #94a3b8;
  flex-shrink: 0;
}
`,
};

export const GALLERY_PURE = {
  tsx: `import React, { useState } from 'react';

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
  className?: string;
}

export default function ImageGalleryCard({
  title = 'Raccolta fotografica',
  photos = [
    {
      id: 'foto-1',
      src: '/src/assets/images/abstract_architectural_light_1794593557682.jpg',
      title: 'Volumi in luce diurna',
      caption: 'Studio di geometria architettonica e ombre nette',
    },
    {
      id: 'foto-2',
      src: '/src/assets/images/abstract_architectural_dusk_1794594109798.jpg',
      title: 'Struttura al crepuscolo',
      caption: 'Contrasto tra cemento freddo e luce interna calda',
    },
    {
      id: 'foto-3',
      src: '/src/assets/images/minimal_studio_landscape_1794593556848.jpg',
      title: 'Orizzonte alpino',
      caption: "Profilo montano immerso nella foschia dell'alba",
    },
    {
      id: 'foto-4',
      src: '/src/assets/images/geometric_sound_cover_1794593556961.jpg',
      title: 'Cerchi concentrici',
      caption: 'Composizione grafica modulare su carta ruvida',
    },
  ],
  showThumbnails = true,
  showCaptions = true,
  className = '',
}: ImageGalleryCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!photos.length) return null;

  const current = photos[activeIdx] || photos[0];
  const prev = () => setActiveIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActiveIdx((i) => (i + 1) % photos.length);

  return (
    <div className={\`mui-gallery \${className}\`}>
      <div className="mui-gallery-top">
        <h3 className="mui-gallery-title">{title}</h3>
        <span className="mui-gallery-count">
          {activeIdx + 1} / {photos.length}
        </span>
      </div>

      <div className="mui-gallery-frame">
        <img
          src={current.src}
          alt={current.title}
          referrerPolicy="no-referrer"
          onClick={() => setZoomed((z) => !z)}
          className={\`mui-gallery-img \${zoomed ? 'is-zoomed' : ''}\`}
        />

        <button
          type="button"
          onClick={prev}
          aria-label="Immagine precedente"
          className="mui-gallery-nav is-prev"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Immagine successiva"
          className="mui-gallery-nav is-next"
        >
          ›
        </button>
      </div>

      {showCaptions && (
        <div className="mui-gallery-caption">
          <p className="mui-gallery-caption-title">{current.title}</p>
          {current.caption && (
            <p className="mui-gallery-caption-sub">{current.caption}</p>
          )}
        </div>
      )}

      {showThumbnails && photos.length > 1 && (
        <div className="mui-gallery-thumbs">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setZoomed(false);
              }}
              className={\`mui-gallery-thumb \${idx === activeIdx ? 'is-active' : ''}\`}
            >
              <img src={photo.src} alt={photo.title} referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
`,
  css: `.mui-gallery {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-gallery-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mui-gallery-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-gallery-count {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.mui-gallery-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background-color: #f1f5f9;
}

.mui-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.mui-gallery-img.is-zoomed {
  transform: scale(1.12);
  cursor: zoom-out;
}

.mui-gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background-color: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  font-size: 1.35rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.mui-gallery-nav:hover {
  background-color: #ffffff;
}

.mui-gallery-nav.is-prev {
  left: 12px;
}

.mui-gallery-nav.is-next {
  right: 12px;
}

.mui-gallery-caption {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
}

.mui-gallery-caption-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.mui-gallery-caption-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-gallery-thumbs {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.mui-gallery-thumb {
  padding: 0;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  opacity: 0.6;
  background: none;
  cursor: pointer;
  transition: opacity 0.15s ease, border-color 0.15s ease;
}

.mui-gallery-thumb:hover {
  opacity: 0.9;
}

.mui-gallery-thumb.is-active {
  border-color: #2563eb;
  opacity: 1;
}

.mui-gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`,
};

export const BEFORE_AFTER_PURE = {
  tsx: `import React, { useRef, useState } from 'react';

export interface BeforeAfterSliderProps {
  title?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
}

export default function BeforeAfterSlider({
  title = 'Confronto visivo luce diurna / crepuscolo',
  beforeImageUrl = '/src/assets/images/abstract_architectural_light_1794593557682.jpg',
  afterImageUrl = '/src/assets/images/abstract_architectural_dusk_1794594109798.jpg',
  beforeLabel = 'Giorno',
  afterLabel = 'Crepuscolo',
  initialPosition = 50,
  className = '',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, Math.round(pct))));
  };

  return (
    <div className={\`mui-compare \${className}\`}>
      {title && (
        <div className="mui-compare-top">
          <h3 className="mui-compare-title">{title}</h3>
          <span className="mui-compare-pct">{position}%</span>
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
        className="mui-compare-stage"
      >
        <img
          src={afterImageUrl}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="mui-compare-img"
        />

        <div
          style={{ clipPath: \`inset(0 \${100 - position}% 0 0)\` }}
          className="mui-compare-before-layer"
        >
          <img
            src={beforeImageUrl}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="mui-compare-img"
          />
        </div>

        {beforeLabel && <span className="mui-compare-tag is-left">{beforeLabel}</span>}
        {afterLabel && <span className="mui-compare-tag is-right">{afterLabel}</span>}

        <div style={{ left: \`\${position}%\` }} className="mui-compare-divider">
          <div className="mui-compare-handle">⇄</div>
        </div>
      </div>

      <div className="mui-compare-slider-row">
        <span>{beforeLabel}</span>
        <input
          type="range"
          aria-label="Posizione confronto"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="mui-compare-range"
        />
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
`,
  css: `.mui-compare {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-compare-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mui-compare-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-compare-pct {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.mui-compare-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background-color: #0f172a;
  user-select: none;
  touch-action: none;
  cursor: ew-resize;
}

.mui-compare-before-layer {
  position: absolute;
  inset: 0;
}

.mui-compare-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mui-compare-tag {
  position: absolute;
  top: 12px;
  background-color: rgba(15, 23, 42, 0.78);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  pointer-events: none;
}

.mui-compare-tag.is-left {
  left: 12px;
}

.mui-compare-tag.is-right {
  right: 12px;
}

.mui-compare-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ffffff;
  transform: translateX(-50%);
  pointer-events: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}

.mui-compare-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background-color: #2563eb;
  border: 2px solid #ffffff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
}

.mui-compare-slider-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
  color: #64748b;
}

.mui-compare-range {
  flex: 1;
  accent-color: #2563eb;
  cursor: pointer;
}
`,
};

export const CAROUSEL_PURE = {
  tsx: `import React, { useEffect, useState } from 'react';

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
  onSlideChange?: (index: number) => void;
  className?: string;
}

export default function CarouselDeck({
  slides = [
    {
      id: 's1',
      kicker: 'Scheda 01',
      title: 'Architettura modulare riutilizzabile',
      description: 'Componenti indipendenti progettati per adattarsi a qualsiasi schema cromatico e gerarchia editoriale.',
      imageUrl: '/src/assets/images/abstract_architectural_light_1794593557682.jpg',
    },
    {
      id: 's2',
      kicker: 'Scheda 02',
      title: 'Equilibrio tra testo e superficie',
      description: 'Proporzioni calibrate per garantire leggibilità costante su desktop, tablet e dispositivi mobili.',
      imageUrl: '/src/assets/images/minimal_studio_landscape_1794593556848.jpg',
    },
    {
      id: 's3',
      kicker: 'Scheda 03',
      title: 'Contrasto notturno e definizione',
      description: 'Struttura solida con supporto immediato a varianti di sfondo chiare o scure.',
      imageUrl: '/src/assets/images/abstract_architectural_dusk_1794594109798.jpg',
    },
  ],
  autoPlay = false,
  intervalMs = 4000,
  showDots = true,
  onSlideChange,
  className = '',
}: CarouselDeckProps) {
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
    <div className={\`mui-carousel \${className}\`}>
      {active.imageUrl && (
        <div className="mui-carousel-media">
          <img src={active.imageUrl} alt={active.title} referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="mui-carousel-body">
        <div className="mui-carousel-top">
          <div>
            {active.kicker && <p className="mui-carousel-kicker">{active.kicker}</p>}
            <h3 className="mui-carousel-title">{active.title}</h3>
          </div>
          <span className="mui-carousel-counter">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <p className="mui-carousel-desc">{active.description}</p>

        <div className="mui-carousel-footer">
          <div className="mui-carousel-btns">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="mui-carousel-btn"
            >
              Precedente
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="mui-carousel-btn"
            >
              Successiva
            </button>
          </div>

          {showDots && (
            <div className="mui-carousel-dots">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={\`Vai alla scheda \${idx + 1}\`}
                  onClick={() => goTo(idx)}
                  className={\`mui-carousel-dot \${idx === index ? 'is-active' : ''}\`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`,
  css: `.mui-carousel {
  width: 100%;
  max-width: 640px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
}

.mui-carousel-media {
  aspect-ratio: 16 / 9;
  width: 100%;
  background-color: #f1f5f9;
  overflow: hidden;
}

.mui-carousel-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mui-carousel-body {
  padding: 24px;
}

.mui-carousel-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.mui-carousel-kicker {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2563eb;
}

.mui-carousel-title {
  margin: 4px 0 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.mui-carousel-counter {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: #64748b;
  flex-shrink: 0;
}

.mui-carousel-desc {
  margin: 10px 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #475569;
}

.mui-carousel-footer {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mui-carousel-btns {
  display: flex;
  gap: 8px;
}

.mui-carousel-btn {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}

.mui-carousel-btn:hover {
  background-color: #f8fafc;
}

.mui-carousel-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mui-carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  padding: 0;
  background-color: #cbd5e1;
  cursor: pointer;
  transition: width 0.2s ease, background-color 0.2s ease;
}

.mui-carousel-dot.is-active {
  width: 22px;
  background-color: #2563eb;
}
`,
};
