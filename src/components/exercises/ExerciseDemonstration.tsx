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
  heroStage?: boolean;
}> = ({ exercise, compact = false, defaultPlaying = false, heroStage = false }) => {
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
    setPlaying(defaultPlaying);
    setFinalPose(false);
  }, [exercise.id, defaultPlaying]);

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
        className={`exercise-stage ${
          heroStage ? '!min-h-[225px] sm:!min-h-[340px] lg:!min-h-[390px]' : ''
        }`}
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
        <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-center justify-between gap-2 no-print">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-bone-white border border-white/10">
            <span
              className={`h-2 w-2 rounded-full ${
                playing
                  ? 'bg-electric-iris shadow-[0_0_10px_#8052ff] animate-pulse'
                  : 'bg-saffron-spark'
              }`}
            />
            {playing
              ? slowMode
                ? '3D Activo · 0.5x'
                : '3D En movimiento'
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
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-bone-white border border-white/15 hover:border-electric-iris hover:text-white transition-colors"
            >
              {use3D ? <Box size={12} className="text-electric-iris" /> : <ImageIcon size={12} />}
              <span>{use3D ? '3D' : '2D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified docked control bar (Dala Dark Void style) */}
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-[#050508]/95 backdrop-blur-md px-3 py-2.5 sm:px-4 no-print">
        <div className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/10 p-0.5">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={!playing && finalPose === value}
              onClick={() => selectPose(value)}
              className={`min-h-[30px] rounded-full px-3 text-[11px] sm:text-xs font-semibold transition-all ${
                !playing && finalPose === value
                  ? 'bg-bone-white text-void shadow-sm'
                  : 'text-ash-gray hover:text-bone-white'
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
              aria-label={slowMode ? 'Velocidad normal' : 'Repetición lenta'}
              title={slowMode ? 'Volver a velocidad normal' : 'Repetición lenta (0.5x)'}
              className={`inline-flex min-h-[32px] items-center gap-1 rounded-full px-3 text-[11px] sm:text-xs font-semibold transition-all border ${
                slowMode
                  ? 'bg-saffron-spark/20 border-saffron-spark text-saffron-spark'
                  : 'bg-white/[0.04] border-white/10 text-silver-mist hover:text-bone-white hover:border-white/25'
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
            className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-silver-mist hover:text-bone-white hover:border-white/25 transition-colors"
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
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-electric-iris px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-[0_0_20px_rgba(128,82,255,0.45)] hover:bg-[#9168ff] transition-all"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              <span>{playing ? 'Pausar' : 'Animar 3D'}</span>
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="border-t border-white/10 px-4 py-3 text-xs sm:text-sm font-light text-silver-mist bg-[#07070c]">
          {exercise.movementCue}
        </p>
      )}
    </div>
  );
};
