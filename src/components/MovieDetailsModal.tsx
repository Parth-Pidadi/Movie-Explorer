'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export default function MovieDetailsModal({ 
  movie, 
  onClose, 
  onToggleFavorite,
  isFavorite 
}: MovieDetailsModalProps) {
  const [details, setDetails] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/movie/${movie.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [movie.id]);

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-900 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-100 transition-all"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <svg className="animate-spin h-12 w-12 text-amber-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 flex-shrink-0">
              {posterUrl ? (
                <div className="relative w-full h-96 md:h-full">
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-l-lg"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              ) : (
                <div className="w-full h-96 md:h-full bg-slate-700 flex items-center justify-center rounded-l-lg">
                  <svg className="w-24 h-24 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="md:w-3/5 p-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-slate-100">{movie.title}</h2>
                <button
                  onClick={() => onToggleFavorite(movie)}
                  className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400'
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-4 text-sm text-amber-400 mb-6">
                <span className="font-medium">{year}</span>
                {details?.runtime && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{details.runtime} min</span>
                  </>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">Overview</h3>
                <p className="text-slate-400 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
