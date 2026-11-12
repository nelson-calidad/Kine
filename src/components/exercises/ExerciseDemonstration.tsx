import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Box, Gauge, Image as ImageIcon, Pause, Play, RotateCcw } from 'lucide-react';
import { Exercise } from '../../types/exercise';

const RehabExerciseScene = lazy(() => import('./three/RehabExerciseScene'));

let cachedWebGLSupport: boolean | null = null;
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  try {
    const canvas = document.createElement('canvas');
    cachedWebGLSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

class ViewerErrorBoundary extends Component<
  { onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const ACTIVE_PLAY_EVENT = 'kine:active-exercise-play';

export const ExerciseDemonstration: React.FC<{
  exercise: Exercise;
  compact?: boolean;
  defaultPlaying?: boolean;
}> = ({ exercise, compact = false, defaultPlaying = false }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(defaultPlaying);
  const [finalPose, setFinalPose] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(query.matches);
      if (query.matches) setPlaying(false);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Pause offscreen viewers and lazy-mount 3D canvas when approaching viewport
  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        } else {
          setPlaying(false);
        }
      },
      { rootMargin: '140px 0px', threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Ensure only one exercise viewer plays continuously at a time
  useEffect(() => {
    const handleOtherPlay = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (custom.detail && custom.detail !== exercise.id) {
        setPlaying(false);
      }
    };
    window.addEventListener(ACTIVE_PLAY_EVENT, handleOtherPlay);
    return () => window.removeEventListener(ACTIVE_PLAY_EVENT, handleOtherPlay);
  }, [exercise.id]);

  // Fallback 2D interval when in 2D mode
  useEffect(() => {
    if (!playing || reduced || (webglSupported && use3D)) return;
    const intervalMs = slowMode ? 3800 : 2400;
    const timer = window.setInterval(() => setFinalPose((value) => !value), intervalMs);
    return () => window.clearInterval(timer);
  }, [playing, reduced, webglSupported, use3D, slowMode]);

  const startPlayback = () => {
    if (reduced) return;
    window.dispatchEvent(new CustomEvent(ACTIVE_PLAY_EVENT, { detail: exercise.id }));
    setPlaying(true);
  };

  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
    } else {
      startPlayback();
    }
  };

  const handleRestart = () => {
    setFinalPose(false);
    setResetSignal((prev) => prev + 1);
    if (!reduced) {
      startPlayback();
    } else {
      setPlaying(false);
    }
  };

  const selectPose = (targetFinal: boolean) => {
    setPlaying(false);
    setFinalPose(targetFinal);
  };

  const show3D = webglSupported && use3D;

  return (
    <div className="exercise-demonstration">
      <div
        ref={stageRef}
        className="exercise-stage"
        role="img"
        aria-label={`${exercise.title}. ${
          finalPose ? exercise.endImageCaption : exercise.startImageCaption
        }`}
      >
        {/* 2D fallback / print illustration */}
        <img
          src={exercise.startImage}
          alt=""
          className={`${finalPose ? 'pose pose-hidden' : 'pose'} ${
            show3D && hasEnteredView ? 'opacity-0 pointer-events-none print:opacity-100' : ''
          }`}
        />
        <img
          src={exercise.endImage}
          alt=""
          className={`${finalPose ? 'pose' : 'pose pose-hidden'} ${
            show3D && hasEnteredView ? 'opacity-0 pointer-events-none' : ''
          }`}
        />

        {/* Lazy-loaded 3D articulated human demonstration */}
        {show3D && hasEnteredView && (
          <div className="absolute inset-0 no-print">
            <ViewerErrorBoundary onError={() => setWebglSupported(false)}>
              <Suspense fallback={null}>
                <RehabExerciseScene
                  exerciseId={exercise.id}
                  playing={playing && !reduced}
                  finalPose={finalPose}
                  slowMode={slowMode}
                  resetSignal={resetSignal}
                  inView={inView}
                />
              </Suspense>
            </ViewerErrorBoundary>
          </div>
        )}

        {/* Top-left subtle status badge & 3D/2D toggle */}
        <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-center justify-between gap-2 no-print">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-brand-navy dark:text-slate-100 shadow-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                playing ? 'bg-brand-teal animate-pulse' : 'bg-brand-navy/60 dark:bg-slate-400'
              }`}
            />
            {playing
              ? slowMode
                ? 'Movimiento 3D · Lento'
                : 'Movimiento 3D activo'
              : finalPose
              ? 'Posición final'
              : 'Posición inicial'}
          </span>

          {webglSupported && (
            <button
              type="button"
              onClick={() => setUse3D((v) => !v)}
              aria-pressed={use3D}
              title={use3D ? 'Cambiar a vista ilustrada 2D' : 'Cambiar a modelo humano 3D'}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-brand-navy dark:text-slate-100 shadow-sm hover:bg-white transition-colors"
            >
              {use3D ? <Box size={13} /> : <ImageIcon size={13} />}
              <span>{use3D ? '3D' : '2D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Control bar: Inicio / Final, Repetición lenta, Reiniciar, Reproducir / Pausar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 pb-3.5 pt-2 no-print">
        <div className="flex items-center gap-1 rounded-full bg-white/85 dark:bg-slate-800/90 p-1 shadow-sm">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={!playing && finalPose === value}
              onClick={() => selectPose(value)}
              className={`min-h-[38px] rounded-full px-3.5 text-xs font-bold transition-colors ${
                !playing && finalPose === value
                  ? 'bg-brand-navy text-white'
                  : 'text-brand-muted hover:text-brand-navy dark:text-slate-300'
              }`}
            >
              {value ? 'Final' : 'Inicio'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {!reduced && (
            <button
              type="button"
              onClick={() => {
                setSlowMode((v) => !v);
                if (!playing) startPlayback();
              }}
              aria-pressed={slowMode}
              aria-label={slowMode ? 'Velocidad normal' : 'Repetición lenta del movimiento'}
              title={slowMode ? 'Volver a velocidad normal' : 'Repetición lenta (0.5x)'}
              className={`inline-flex min-h-[38px] items-center gap-1 rounded-full px-3 text-xs font-bold transition-colors shadow-sm ${
                slowMode
                  ? 'bg-brand-teal text-white'
                  : 'bg-white/90 dark:bg-slate-800/90 text-brand-navy dark:text-slate-200 hover:bg-white'
              }`}
            >
              <Gauge size={14} aria-hidden="true" />
              <span>Lenta</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Reiniciar movimiento"
            title="Reiniciar desde posición inicial"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-brand-navy dark:text-slate-200 shadow-sm hover:bg-white transition-colors"
          >
            <RotateCcw size={16} />
          </button>

          {!reduced && (
            <button
              type="button"
              aria-label={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              title={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              aria-pressed={playing}
              onClick={togglePlayback}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-navy/90 transition-colors"
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
              <span>{playing ? 'Pausar' : 'Reproducir'}</span>
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="border-t border-white/70 dark:border-slate-700/60 px-5 py-3.5 text-sm text-brand-text dark:text-slate-200">
          {exercise.movementCue}
        </p>
      )}
      {!compact && exercise.video && (
        <video
          className="w-full rounded-xl"
          controls
          playsInline
          preload="metadata"
          src={exercise.video}
        />
      )}
    </div>
  );
};
