'use client';

import Image from 'next/image';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onViewDetails: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export default function MovieCard({ 
  movie, 
  onViewDetails, 
  onToggleFavorite,
  isFavorite 
}: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-slate-700">
      <div 
        className="relative h-80 bg-slate-700 cursor-pointer"
        onClick={() => onViewDetails(movie)}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 
            className="text-lg font-semibold text-slate-100 line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors"
            onClick={() => onViewDetails(movie)}
          >
            {movie.title}
          </h3>
          <button
            onClick={() => onToggleFavorite(movie)}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-amber-400 font-medium mb-2">{year}</p>
        
        <p className="text-sm text-slate-400 line-clamp-3">
          {movie.overview || 'No description available.'}
        </p>
      </div>
    </div>
  );
}
