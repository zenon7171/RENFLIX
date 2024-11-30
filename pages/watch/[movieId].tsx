import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useMovie from '@/hooks/useMovie';

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;

  const { data } = useMovie(movieId as string);

  // 動画 URL を判定し埋め込み形式に変換
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return '';

    // YouTube URL の場合、埋め込み形式に変換し自動再生やロゴ非表示のパラメータを追加
    const youtubeMatch =
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1`;
    }

    // Loom URL の場合、埋め込み形式に変換して不要な要素を非表示に
    const loomMatch = url.match(/(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/);

    if (loomMatch) {
      const videoId = loomMatch[1];
      return `https://www.loom.com/embed/${videoId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&autoplay`;
    }

    // MP4 用 URL の場合そのまま返す
    return url;
  };

  const videoUrl = getEmbedUrl(data?.videoUrl);
  const isYoutube = videoUrl.includes('youtube.com/embed');
  const isLoom = videoUrl.includes('loom.com/embed');

  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon
          onClick={() => router.push('/')}
          className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition"
        />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">現在視聴中の動画:</span> {data?.title}
        </p>
      </nav>

      {/* 動画プレーヤー */}
      <div className="h-full w-full">
        {isYoutube || isLoom ? (
          <iframe
            src={videoUrl}
            title={data?.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        ) : (
          <video className="h-full w-full" autoPlay controls src={videoUrl}></video>
        )}
      </div>
    </div>
  );
};

export default Watch;