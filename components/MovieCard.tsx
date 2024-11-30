import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

import { MovieInterface } from '@/types';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';

interface MovieCardProps {
  data: MovieInterface;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useInfoModalStore();
  const [hoverPosition, setHoverPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // スケルトン用の状態

  const redirectToWatch = useCallback(() => router.push(`/watch/${data.id}`), [router, data.id]);

  const isNew = (createdAt: Date) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 14; // 2週間以内かどうか
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: rect.top + window.scrollY - rect.height * 0.1 + 30, // 元の位置を再現
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      setHoverPosition(null);
    }, 300); // アニメーション終了を待つ
  };

  return (
    <div
      className="group bg-zinc-900 col-span relative h-[12vw] overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* サムネイル画像をプリロード */}
      <link rel="preload" href={data.thumbnailUrl} as="image" />

      {/* スケルトンスクリーン */}
      {!isLoaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-700 animate-pulse rounded-md" />
      )}

      {/* サムネイル画像 */}
      <img
        onClick={redirectToWatch}
        src={data.thumbnailUrl}
        alt="Movie"
        draggable={false}
        loading="eager" // Lazy Loading を無効化
        onLoad={() => setIsLoaded(true)} // ロード完了でスケルトンを非表示
        className={`
          cursor-pointer
          object-cover
          transition-opacity
          duration-100
          ease-in-out
          shadow-xl
          rounded-md
          w-full
          h-[12vw]
          ${isLoaded ? 'opacity-100' : 'opacity-0'} // ロード中は非表示
        `}
      />
      {/* ポップアップ */}
      {hoverPosition &&
        createPortal(
          <div
            className={`
              absolute
              z-[1000]
              bg-zinc-800
              shadow-xl
              rounded-md
              overflow-hidden
              transition-all
              duration-300
              ease-in-out
              ${isHovered ? 'opacity-100 scale-105 translate-y-[-2vw]' : 'opacity-0 scale-100'}
            `}
            style={{
              top: hoverPosition.top,
              left: hoverPosition.left,
              width: hoverPosition.width,
              position: 'absolute',
            }}
          >
            {/* ポップアップ内の画像 */}
            <img
              onClick={redirectToWatch}
              src={data.thumbnailUrl}
              alt="Movie"
              draggable={false}
              className="
                cursor-pointer
                object-cover
                shadow-xl
                rounded-t-md
                w-full
                h-[12vw]
              "
            />
            {/* ポップアップ詳細 */}
            <div
              className="
                p-2
                lg:p-4
                w-full
                shadow-md
                bg-zinc-800
                rounded-b-md
              "
            >
              <div className="flex flex-row items-center gap-3">
                <div
                  onClick={redirectToWatch}
                  className="
                    cursor-pointer
                    w-6
                    h-6
                    lg:w-10
                    lg:h-10
                    bg-white
                    rounded-full
                    flex
                    justify-center
                    items-center
                  "
                >
                  <PlayIcon className="text-black w-4 lg:w-6" />
                </div>
                <FavoriteButton movieId={data.id} />
                <div
                  onClick={() => openModal(data?.id)}
                  className="
                    cursor-pointer
                    ml-auto
                    w-6
                    h-6
                    lg:w-10
                    lg:h-10
                    border-white
                    border-2
                    rounded-full
                    flex
                    justify-center
                    items-center
                  "
                >
                  <ChevronDownIcon className="text-white w-4 lg:w-6" />
                </div>
              </div>
              <p className="text-green-400 font-semibold mt-4">
                {isNew(new Date(data.createdAt)) && "NEW"}{" "}
                <span className="text-white">{data.title}</span>
              </p>
              <div className="flex flex-row mt-3 gap-2 items-center">
                <p className="text-white">{formatDate(new Date(data.createdAt))}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-white text-[10px] lg:text-sm">再生時間:{data.duration}</p>
              </div>
              <div className="flex flex-row items-center gap-2 mt-4 text-[8px] text-white lg:text-sm">
                <p>カテゴリー:{data.genre}</p>
              </div>
            </div>
          </div>,
          document.body // ポップアップをbody直下に変更
        )}
    </div>
  );
};

export default MovieCard;
