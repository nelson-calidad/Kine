import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseDetail } from '../components/exercises/ExerciseDetail';
import { EmptyState } from '../components/common/EmptyState';

export const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const currentIndex = EXERCISES_DATA.findIndex((item) => item.id === id);
  const exercise = currentIndex >= 0 ? EXERCISES_DATA[currentIndex] : null;

  if (!exercise) {
    return (
      <div className="py-8">
        <EmptyState
          title="Ejercicio no encontrado"
          description="El ejercicio que buscás no existe o el enlace fue modificado."
          actionLabel="Ir a Mis ejercicios"
          onAction={() => navigate('/ejercicios')}
        />
      </div>
    );
  }

  const prevExercise = currentIndex > 0 ? EXERCISES_DATA[currentIndex - 1] : null;
  const nextExercise =
    currentIndex < EXERCISES_DATA.length - 1 ? EXERCISES_DATA[currentIndex + 1] : EXERCISES_DATA[0];

  return (
    <ExerciseDetail
      exercise={exercise}
      prevExercise={prevExercise}
      nextExercise={nextExercise}
    />
  );
};
