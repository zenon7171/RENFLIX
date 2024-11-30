import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import useSearchMovies from '@/hooks/useSearchMovies';
import SearchResultCard from '@/components/SearchResultCard';

const SearchPage = () => {
  const router = useRouter();
  const { keyword } = router.query; // URLクエリパラメータを取得
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>();

  const { movies, loading, error } = useSearchMovies(searchKeyword || '');

  // クエリが変更されたら状態を更新
  useEffect(() => {
    if (typeof keyword === 'string') {
      setSearchKeyword(keyword);
    }
  }, [keyword]);

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-white text-2xl mb-4 mt-20">検索結果</h1>
        
        {loading && <p className="text-white">読み込み中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {movies.map((movie) => (
              <SearchResultCard key={movie.id} data={movie} />
            ))}
          </div>
        ) : (
          !loading && <p className="text-white">該当する動画が見つかりませんでした。</p>
        )}
      </div>
    </>
  );
};

export default SearchPage;