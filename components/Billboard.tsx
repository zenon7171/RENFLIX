import React, { useCallback, useRef, useState, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import PlayButton from '@/components/PlayButton';
import useBillboard from '@/hooks/useBillboard';
import useInfoModalStore from '@/hooks/useInfoModalStore';

const Billboard: React.FC = () => {
  const { openModal } = useInfoModalStore();
  const { data, isLoading, error } = useBillboard();
  const [isVideoVisible, setIsVideoVisible] = useState(false); // 動画表示制御
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenModal = useCallback(() => {
    openModal(data?.id);
  }, [openModal, data?.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-[56.25vw] bg-gray-800 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[56.25vw] bg-gray-800 flex items-center justify-center">
        <div className="text-red-500">Error loading billboard.</div>
      </div>
    );
  }

  return (
    <div className="relative h-[56.25vw]">
      {data && (
        <video
          ref={videoRef}
          poster={data.thumbnailUrl}
          className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500"
          autoPlay={isVideoVisible} // 可視状態でのみ再生
          muted
          loop
          src={isVideoVisible ? data.videoUrl : undefined} // 可視状態でのみURLを設定
        />
      )}
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl h-full w-[100%] lg:text-6xl font-bold drop-shadow-xl">
          {data?.title || <span className="animate-pulse bg-gray-500 h-6 w-32 inline-block" />}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.description || (
            <span className="animate-pulse bg-gray-500 h-4 w-64 inline-block" />
          )}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3" style={{ color: '#323232' }}>
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="
              bg-white
              text-white
              bg-opacity-30 
              rounded-md 
              py-1 md:py-2 
              px-2 md:px-4
              w-auto 
              text-xs lg:text-lg 
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
            "
          >
            <InformationCircleIcon className="w-4 md:w-7 mr-1" />
            詳細
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
