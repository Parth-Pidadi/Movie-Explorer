'use client';

import Image from 'next/image';
import { FavoriteMovie } from '@/types';

interface FavoritesListProps {
  favorites: FavoriteMovie[];
  onRemoveFavorite: (id: number) => void;
  onUpdateFavorite: (id: number, updates: Partial<FavoriteMovie>) => void;
  onViewDetails: (movie: FavoriteMovie) => void;
}

export default function FavoritesList({ 
  favorites, 
  onRemoveFavorite, 
  onUpdateFavorite,
  onViewDetails 
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-400 mb-2">No favorites yet</h3>
        <p className="text-slate-500">Start adding movies to your favorites list!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {favorites.map((movie) => {
        const posterUrl = movie.poster_path 
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null;

        const year = movie.release_date 
          ? new Date(movie.release_date).getFullYear() 
          : 'N/A';

        return (
          <div 
            key={movie.id} 
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 transition-colors"
          >
            <div className="flex flex-col sm:flex-row">
              <div 
                className="sm:w-48 h-64 sm:h-auto bg-slate-700 flex-shrink-0 cursor-pointer relative"
                onClick={() => onViewDetails(movie)}
              >
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="cursor-pointer hover:text-amber-400 transition-colors"
                    onClick={() => onViewDetails(movie)}
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-1">{movie.title}</h3>
                    <p className="text-sm text-amber-400 font-medium">{year}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(movie.id)}
                    className="flex-shrink-0 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Rating
                    </label>
                    <select
                      value={movie.personalRating || ''}
                      onChange={(e) => onUpdateFavorite(movie.id, { 
                        personalRating: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select rating...</option>
                      <option value="1">⭐ 1 - Poor</option>
                      <option value="2">⭐⭐ 2 - Fair</option>
                      <option value="3">⭐⭐⭐ 3 - Good</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Great</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Personal Notes
                    </label>
                    <textarea
                      value={movie.personalNote || ''}
                      onChange={(e) => onUpdateFavorite(movie.id, { 
                        personalNote: e.target.value 
                      })}
                      placeholder="Add your thoughts about this movie..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
