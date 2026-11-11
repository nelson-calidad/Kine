import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ExercisesPage } from '../pages/ExercisesPage';
import { ExerciseDetailPage } from '../pages/ExerciseDetailPage';
import { CarePage } from '../pages/CarePage';
import { AvoidPage } from '../pages/AvoidPage';
import { DailyActivitiesPage } from '../pages/DailyActivitiesPage';
import { AlertsPage } from '../pages/AlertsPage';
import { TrackingPage } from '../pages/TrackingPage';
import { FAQPage } from '../pages/FAQPage';
import { SurgeryPage } from '../pages/SurgeryPage';
import { SourcesPage } from '../pages/SourcesPage';
import { EmptyState } from '../components/common/EmptyState';

const ScrollToTopOnRouteChange: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="py-12">
      <EmptyState
        title="Página no encontrada"
        description="La dirección que ingresaste no corresponde a una sección activa de la guía."
        actionLabel="Volver al inicio"
        onAction={() => navigate('/')}
      />
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ejercicios" element={<ExercisesPage />} />
        <Route path="/ejercicios/:id" element={<ExerciseDetailPage />} />
        <Route path="/cuidados" element={<CarePage />} />
        <Route path="/que-evitar" element={<AvoidPage />} />
        <Route path="/actividades" element={<DailyActivitiesPage />} />
        <Route path="/alertas" element={<AlertsPage />} />
        <Route path="/seguimiento" element={<TrackingPage />} />
        <Route path="/preguntas" element={<FAQPage />} />
        <Route path="/mi-cirugia" element={<SurgeryPage />} />
        <Route path="/fuentes" element={<SourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
