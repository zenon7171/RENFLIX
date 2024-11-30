import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import VideoJSPlayer from '@/pages/watch/VideoJSPlayer';

import PlayButton from '@/components/PlayButton';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import useMovie from '@/hooks/useMovie';
import useMovieList from '@/hooks/useMovieList';
import { useRouter } from 'next/router';

interface InfoModalProps {
  visible?: boolean;
  onClose: () => void;
}

interface MovieInterface {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  duration: string;
  genre: string;
  videoUrl: string;
  createdAt: string;
}

// スライドイン・スライドアウトのアニメーション
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 新着動画リスト用カード
const MovieCard: React.FC<{ movie: MovieInterface }> = ({ movie }) => {
  const router = useRouter();

  const handleThumbnailClick = () => {
    router.push(`/watch/${movie.id}`);
  };

  return (
    <div className="bg-[#202020] rounded-md overflow-hidden shadow-md">
      <img
        src={movie.thumbnailUrl}
        alt={movie.title}
        className="w-full h-36 object-cover cursor-pointer"
        onClick={handleThumbnailClick}
      />
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-sm font-semibold line-clamp-2">{movie.title}</p>
          <div className="ml-1" style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
            <FavoriteButton movieId={movie.id} />
          </div>
        </div>
        <p className="text-gray-400 text-xs line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );
};

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  const { movieId } = useInfoModalStore();
  const { data: movieData } = useMovie(movieId); // 単一の映画データ
  const { data: movies = [] } = useMovieList(); // 全体の映画リスト

  const [randomMovies, setRandomMovies] = useState<MovieInterface[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // ランダムな関連動画を生成
  useEffect(() => {
    if (movies.length > 0) {
      const shuffled = [...movies].sort(() => 0.5 - Math.random());
      setRandomMovies(shuffled.slice(0, 12));
    }
  }, [movies]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // 動画 URL を判定し埋め込み形式に変換
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return '';

    // YouTube URL の場合
    const youtubeMatch =
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1`;
    }

    // Loom URL の場合
    const loomMatch = url.match(/(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/);

    if (loomMatch) {
      const videoId = loomMatch[1];
      return `https://www.loom.com/embed/${videoId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&autoplay=true&muted=true`;
    }

    // MP4 用 URL の場合そのまま返す
    return url;
  };

  const videoUrl = getEmbedUrl(movieData?.videoUrl);
  const isYoutube = videoUrl.includes('youtube.com/embed');
  const isLoom = videoUrl.includes('loom.com/embed');
  const isMP4 = movieData?.videoUrl?.endsWith('.mp4');

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={Boolean(visible)}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogContent sx={{ p: 0, bgcolor: '#181818' }}>
        <div className="relative">
          <div className="relative" style={{ paddingTop: '56.25%' }}>
            {movieData?.videoUrl && (
              <div className="absolute top-0 left-0 w-full h-full">
                {isYoutube || isLoom ? (
                  <iframe
                    src={videoUrl}
                    title={movieData?.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                ) : isMP4 ? (
                  <video className="h-full w-full" autoPlay controls muted={isMuted} src={movieData?.videoUrl}></video>
                ) : null}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-6 left-10 z-10">
              <p className="text-3xl font-bold text-white mb-4">{movieData?.title}</p>
              <div className="flex gap-4 mb-4">
                <PlayButton movieId={movieData?.id} />
                <FavoriteButton movieId={movieData?.id} />
                <button
                  onClick={toggleMute}
                  className="h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center"
                >
                  {isMuted ? <FaVolumeMute className="text-white w-6" /> : <FaVolumeUp className="text-white w-6" />}
                </button>
              </div>
              <p className="text-green-400 font-semibold">New</p>
              <p className="text-white">再生時間: {movieData?.duration}</p>
              <p className="text-white">{movieData?.description}</p>
              <p className="text-gray-400">カテゴリー: {movieData?.genre}</p>
            </div>
            <div
              onClick={onClose}
              className="absolute top-3 right-3 h-10 w-10 bg-black bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer"
            >
              <XMarkIcon className="text-white w-6" />
            </div>
          </div>
          <div className="px-12 pb-8">
            <h3 className="text-white text-lg font-bold mb-4">関連動画</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {randomMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;