import { useState, useEffect } from 'react';
import axios from 'axios';
import { MovieInterface } from '@/types';

export default function useSearchMovies(keyword: string) {
  const [movies, setMovies] = useState<MovieInterface[]>([]); // 型を指定
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/movies/search?keyword=${encodeURIComponent(keyword)}`);
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('検索結果の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [keyword]);

  return { movies, loading, error };
}