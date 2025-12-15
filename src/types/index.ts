export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  runtime?: number; // Only available in details view
}

export interface FavoriteMovie extends Movie {
  personalRating?: number; // 1-5
  personalNote?: string;
  favoritedAt: number;
}
