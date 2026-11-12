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
        {/* 2D fallback / print illustration (hidden on screen when 3D is active) */}
        <div className={show3D && hasEnteredView ? 'hidden print:block' : 'block'}>
          <img
            src={exercise.startImage}
            alt=""
            className={finalPose ? 'pose pose-hidden' : 'pose'}
          />
          <img
            src={exercise.endImage}
            alt=""
            className={finalPose ? 'pose' : 'pose pose-hidden'}
          />
        </div>

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

        {/* Subtle top status pill & 3D/2D switch */}
        <div className="pointer-events-none absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between gap-2 no-print">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-brand-navy dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                playing ? 'bg-brand-teal animate-pulse' : 'bg-brand-navy/50 dark:bg-slate-400'
              }`}
            />
            {playing
              ? slowMode
                ? 'En movimiento · 0.5x'
                : 'En movimiento'
              : finalPose
              ? 'Posición final'
              : 'Posición inicial'}
          </span>

          {webglSupported && (
            <button
              type="button"
              onClick={() => setUse3D((v) => !v)}
              aria-pressed={use3D}
              title={use3D ? 'Ver esquema 2D' : 'Ver demostración 3D'}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-brand-navy dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white transition-colors"
            >
              {use3D ? <Box size={12} /> : <ImageIcon size={12} />}
              <span>{use3D ? '3D' : '2D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified docked control bar */}
      <div className="flex items-center justify-between gap-1.5 border-t border-slate-200/55 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-2.5 py-2 sm:px-3.5 no-print">
        <div className="inline-flex items-center rounded-full bg-slate-100/90 dark:bg-slate-800 p-0.5">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={!playing && finalPose === value}
              onClick={() => selectPose(value)}
              className={`min-h-[30px] rounded-full px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold transition-all ${
                !playing && finalPose === value
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy dark:text-slate-300'
              }`}
            >
              {value ? 'Final' : 'Inicio'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {!reduced && (
            <button
              type="button"
              onClick={() => {
                setSlowMode((v) => !v);
                if (!playing) startPlayback();
              }}
              aria-pressed={slowMode}
              aria-label={slowMode ? 'Velocidad normal' : 'Repetición lenta'}
              title={slowMode ? 'Volver a velocidad normal' : 'Repetición lenta (0.5x)'}
              className={`inline-flex min-h-[32px] items-center gap-1 rounded-full px-2.5 text-[11px] sm:text-xs font-semibold transition-colors ${
                slowMode
                  ? 'bg-brand-teal text-white'
                  : 'bg-slate-100/90 dark:bg-slate-800 text-brand-navy dark:text-slate-200 hover:bg-slate-200/70'
              }`}
            >
              <Gauge size={13} aria-hidden="true" />
              <span>0.5x</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Reiniciar movimiento"
            title="Reiniciar desde el inicio"
            className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-slate-100/90 dark:bg-slate-800 text-brand-navy dark:text-slate-200 hover:bg-slate-200/70 transition-colors"
          >
            <RotateCcw size={14} />
          </button>

          {!reduced && (
            <button
              type="button"
              aria-label={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              title={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              aria-pressed={playing}
              onClick={togglePlayback}
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-brand-navy px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-sm hover:bg-brand-navy/90 transition-colors"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              <span>{playing ? 'Pausar' : 'Animar'}</span>
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="border-t border-slate-200/60 dark:border-slate-800 px-4 py-3 text-xs sm:text-sm text-brand-text dark:text-slate-200 bg-white/60 dark:bg-slate-900/50">
          {exercise.movementCue}
        </p>
      )}
    </div>
  );
};
