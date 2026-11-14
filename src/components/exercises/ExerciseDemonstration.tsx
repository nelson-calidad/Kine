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
          heroStage ? '!min-h-[225px] sm:!min-h-[330px] lg:!min-h-[380px]' : ''
        }`}
        role="img"
        aria-label={`${exercise.title}. ${
          finalPose ? exercise.endImageCaption : exercise.startImageCaption
        }`}
      >
        {/* 2D fallback / print illustration */}
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

        {/* Top status pill & 3D/2D switch (High-contrast White on Deep Navy) */}
        <div className="pointer-events-none absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between gap-2 no-print">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#061523]/85 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wide text-white border border-cyan-300/25">
            <span
              className={`h-2 w-2 rounded-full ${
                playing
                  ? 'bg-[#38d9d6] shadow-[0_0_8px_#38d9d6] animate-pulse'
                  : 'bg-sky-300'
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
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#061523]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-cyan-300/30 hover:border-[#38d9d6] transition-colors"
            >
              {use3D ? <Box size={12} className="text-[#38d9d6]" /> : <ImageIcon size={12} />}
              <span>{use3D ? '3D' : '2D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified docked control bar (Deep Navy + Celeste/Turquoise + White) */}
      <div className="flex items-center justify-between gap-2 border-t border-cyan-300/20 bg-[#081b2d] px-3 py-2 sm:px-4 no-print">
        <div className="inline-flex items-center rounded-full bg-[#05111d] border border-cyan-300/20 p-0.5">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={!playing && finalPose === value}
              onClick={() => selectPose(value)}
              className={`min-h-[28px] rounded-full px-3 text-[11px] sm:text-xs font-bold transition-all ${
                !playing && finalPose === value
                  ? 'bg-[#38d9d6] text-[#041421] shadow-sm'
                  : 'text-sky-200 hover:text-white'
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
              className={`inline-flex min-h-[30px] items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-all border ${
                slowMode
                  ? 'bg-[#38d9d6]/25 border-[#38d9d6] text-white'
                  : 'bg-[#05111d] border-cyan-300/20 text-sky-100 hover:border-cyan-300/50'
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
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#05111d] border border-cyan-300/20 text-sky-100 hover:text-white hover:border-cyan-300/50 transition-colors"
          >
            <RotateCcw size={13} />
          </button>

          {!reduced && (
            <button
              type="button"
              aria-label={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              title={playing ? 'Pausar demostración' : 'Reproducir demostración'}
              aria-pressed={playing}
              onClick={togglePlayback}
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-[#1db8c4] px-3.5 py-1 text-[11px] sm:text-xs font-bold text-white shadow-[0_0_18px_rgba(56,217,214,0.35)] hover:bg-[#28cbd6] transition-all"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              <span>{playing ? 'Pausar' : 'Animar'}</span>
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="border-t border-cyan-300/15 px-4 py-2.5 text-xs sm:text-sm text-sky-100 bg-[#071828]">
          {exercise.movementCue}
        </p>
      )}
    </div>
  );
};
