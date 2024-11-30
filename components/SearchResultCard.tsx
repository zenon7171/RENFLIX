import React from 'react';
import { useRouter } from 'next/router';
import { PlayIcon } from '@heroicons/react/24/solid';
import { MovieInterface } from '@/types';
import FavoriteButton from '@/components/FavoriteButton';

interface SearchResultCardProps {
  data: MovieInterface;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ data }) => {
  const router = useRouter();

  const redirectToWatch = () => router.push(`/watch/${data.id}`);

  return (
    <div
      className="
        bg-zinc-900
        p-4
        rounded-md
        shadow-md
        flex
        flex-col
        lg:flex-row
        gap-4
        items-center
        transition
        hover:shadow-lg
        hover:bg-zinc-800
        cursor-pointer
      "
      onClick={redirectToWatch}
    >
      {/* サムネイル */}
      <img
        src={data.thumbnailUrl}
        alt={data.title}
        className="w-full lg:w-40 h-24 lg:h-40 object-cover rounded-md"
      />
      
      {/* 詳細情報 */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-white text-lg font-semibold">{data.title}</h3>
        <p className="text-gray-400 text-sm">{data.description}</p>
        <div className="flex flex-row gap-2 items-center text-sm text-white">
          <p>ジャンル: {data.genre}</p>
          <p>| 再生時間: {data.duration}</p>
        </div>
        <div className="flex flex-row gap-4 items-center mt-2">
          {/* 再生ボタン */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // 親のクリックイベントを防ぐ
              redirectToWatch();
            }}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              bg-white
              rounded-full
              transition
              hover:bg-gray-300
            "
          >
            <PlayIcon className="w-6 text-black" />
          </div>
          {/* お気に入りボタン */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // 親のクリックイベントを防ぐ
            }}
          >
            <FavoriteButton movieId={data.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;