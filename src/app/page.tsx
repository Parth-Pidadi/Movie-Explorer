'use client';

import { useState } from 'react';
import { Movie, FavoriteMovie } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import FavoritesList from '@/components/FavoritesList';

type Tab = 'search' | 'favorites';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    updateFavorite, 
    isFavorite,
    isLoaded 
  } = useFavorites();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchError('Failed to fetch movies. Please try again.');
      setSearchResults([]);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      const favoriteMovie: FavoriteMovie = {
        ...movie,
        favoritedAt: Date.now(),
      };
      addFavorite(favoriteMovie);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              🎬 Movie Explorer
            </h1>
            
            <div className="flex gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'favorites'
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Favorites
                {isLoaded && favorites.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'favorites'
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' ? (
          <div className="space-y-8">
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />

            {/* Error Message */}
            {searchError && (
              <div className="max-w-3xl mx-auto bg-red-900 bg-opacity-30 border border-red-500 text-red-200 px-4 py-3 rounded">
                {searchError}
              </div>
            )}

            {/* Search Results */}
            {hasSearched && !isSearching && searchResults.length === 0 && !searchError && (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No movies found</h3>
                <p className="text-slate-500">Try searching with a different title</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-6">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onViewDetails={setSelectedMovie}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={isFavorite(movie.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              My Favorites {isLoaded && favorites.length > 0 && `(${favorites.length})`}
            </h2>
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={removeFavorite}
              onUpdateFavorite={updateFavorite}
              onViewDetails={setSelectedMovie}
            />
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite(selectedMovie.id)}
        />
      )}
    </main>
  );
}
