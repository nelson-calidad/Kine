import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Box, Camera, Gauge, Image as ImageIcon, Pause, Play, RotateCcw } from 'lucide-react';
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
  const [cameraResetSignal, setCameraResetSignal] = useState(0);
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

  const handleResetCamera = () => {
    setCameraResetSignal((prev) => prev + 1);
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
          heroStage ? '!min-h-[250px] sm:!min-h-[360px] lg:!min-h-[420px]' : ''
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
                  cameraResetSignal={cameraResetSignal}
                  inView={inView}
                />
              </Suspense>
            </ViewerErrorBoundary>
          </div>
        )}

        {/* Discreet top status & 3D/2D switch */}
        <div className="pointer-events-none absolute left-3 right-3 top-2.5 flex items-center justify-between gap-2 no-print">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#061522]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-[#F1F7FA] border border-[#244154]">
            <span
              className={`h-2 w-2 rounded-full ${
                playing ? 'bg-[#25C8CC]' : 'bg-[#82E5E4]'
              }`}
            />
            {playing
              ? slowMode
                ? 'En movimiento · 0.5x'
                : 'En movimiento · Arrastrá para rotar'
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
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#061522]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-[#F1F7FA] border border-[#244154] hover:border-[#25C8CC] transition-colors"
            >
              {use3D ? <Box size={12} className="text-[#25C8CC]" /> : <ImageIcon size={12} />}
              <span>{use3D ? '3D' : '2D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified clean control bar: Posición inicial/final · Velocidad · Restablecer cámara · Reiniciar · Reproducir/Pausar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#244154] bg-[#0B2030] px-3 py-2 sm:px-4 no-print">
        <div className="inline-flex items-center rounded-full bg-[#061522] border border-[#244154] p-0.5">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={!playing && finalPose === value}
              onClick={() => selectPose(value)}
              className={`min-h-[28px] rounded-full px-2.5 sm:px-3 text-[11px] font-semibold transition-colors ${
                !playing && finalPose === value
                  ? 'bg-[#25C8CC] text-[#061522]'
                  : 'text-[#A7B9C6] hover:text-[#F1F7FA]'
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
              aria-label={slowMode ? 'Velocidad normal (1x)' : 'Velocidad lenta (0.5x)'}
              title={slowMode ? 'Volver a velocidad normal (1x)' : 'Velocidad lenta (0.5x)'}
              className={`inline-flex min-h-[30px] items-center gap-1 rounded-full px-2.5 text-[11px] font-medium transition-colors border ${
                slowMode
                  ? 'bg-[#25C8CC]/20 border-[#25C8CC] text-[#F1F7FA]'
                  : 'bg-[#061522] border-[#244154] text-[#A7B9C6] hover:text-[#F1F7FA]'
              }`}
            >
              <Gauge size={13} aria-hidden="true" />
              <span>{slowMode ? '0.5x' : '1x'}</span>
            </button>
          )}

          {show3D && (
            <button
              type="button"
              onClick={handleResetCamera}
              aria-label="Restablecer cámara"
              title="Restablecer encuadre de cámara"
              className="inline-flex min-h-[30px] items-center gap-1 rounded-full bg-[#061522] border border-[#244154] px-2.5 text-[11px] font-medium text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
            >
              <Camera size={13} />
              <span className="hidden sm:inline">Encuadrar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Reiniciar movimiento"
            title="Reiniciar animación"
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#061522] border border-[#244154] text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
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
              className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full bg-[#25C8CC] px-3.5 py-1 text-[11px] font-semibold text-[#061522] hover:bg-[#82E5E4] transition-colors"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              <span>{playing ? 'Pausar' : 'Reproducir'}</span>
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="border-t border-[#244154] px-4 py-2.5 text-xs sm:text-sm text-[#A7B9C6] bg-[#0B2030]">
          {exercise.movementCue}
        </p>
      )}
    </div>
  );
};
