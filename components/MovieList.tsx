import React, { useRef, useState } from 'react';
import { MovieInterface } from '@/types';
import MovieCard from '@/components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface MovieListProps {
  data: MovieInterface[];
  title: string;
  useSlider?: boolean; // スライダーを使うかどうかを指定
}

const MovieList: React.FC<MovieListProps> = ({ data, title, useSlider = true }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 表示するスライド数
  const slidesToShow = 4; // 1画面に表示する要素数
  const totalSlides = data.length;

  const maxIndex = Math.ceil(totalSlides / slidesToShow) - 1; // 最大スライドページ数

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0)); // 最後なら0に戻す
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex)); // 最初なら最後に戻る
  };

  const slideWidthPercentage = 100 / slidesToShow; // 各スライドの幅（%）
  const gapPx = 8; // gap-2に対応
  const totalGapPx = (slidesToShow - 1) * gapPx;
  const gapPerItemPx = totalGapPx / slidesToShow;

  return (
    <div className="relative px-4 md:px-12 mt-4 space-y-8 overflow-hidden z-10">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">{title}</p>
        <div className="relative overflow-hidden z-10">
          {useSlider ? (
            <div className="relative flex items-center">
              {/* 前へボタン */}
              <button
                onClick={handlePrev}
                className="absolute left-0 bg-[#141a2242] text-white p-2 rounded z-[1100] h-full w-10 flex items-center justify-center pointer-events-auto"
              >
                <FontAwesomeIcon icon={faChevronLeft} size="lg" />
              </button>

              {/* スライダー */}
              <div className="w-full overflow-hidden relative mx-12">
                <div
                  ref={sliderRef}
                  className="flex gap-2 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`, // 正確な移動量
                  }}
                >
                  {data.map((movie) => (
                    <div
                      key={movie.id}
                      className="shrink-0"
                      style={{
                        width: `calc(${slideWidthPercentage}% - ${gapPerItemPx}px)`, // 各スライドの幅からギャップを差し引く
                      }}
                    >
                      <MovieCard data={movie} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 次へボタン */}
              <button
                onClick={handleNext}
                className="absolute right-0 bg-[#141a2242] text-white p-2 rounded z-[1100] h-full w-10 flex items-center justify-center pointer-events-auto"
              >
                <FontAwesomeIcon icon={faChevronRight} size="lg" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((movie) => (
                <MovieCard key={movie.id} data={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;