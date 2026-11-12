import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ExerciseImageProps {
  src: string;
  alt: string;
  title: string;
  category?: string;
  className?: string;
}

export const ExerciseImage: React.FC<ExerciseImageProps> = ({
  src,
  alt,
  title,
  category,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt || `Ilustración pendiente para ${title}`}
        className={`flex flex-col items-center justify-center rounded-2xl bg-brand-soft/60 border border-brand-teal/25 p-6 text-center ${className}`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-navy shadow-sm">
          <ImageIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        {category && (
          <span className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-teal">
            {category}
          </span>
        )}
        <p className="text-base font-bold text-brand-navy">{title}</p>
        <p className="mt-1 text-xs text-brand-muted">
          Ilustración no disponible
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-transparent ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
};
