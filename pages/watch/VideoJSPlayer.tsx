import { useEffect, useRef } from "react";
import Player from "video.js/dist/types/player";
import videojs from "video.js";
import "videojs-youtube";
import "video.js/dist/video-js.css";

export default function VideoJSPlayer({
  options,
  onReady,
}: {
  options: any;
  onReady: (player: Player) => void;
}) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...options,
          youtube: {
            modestbranding: 1, // ロゴを最小限に
            rel: 0,            // 関連動画を非表示
            showinfo: 0,       // 情報を非表示
            iv_load_policy: 3, // アノテーションを非表示
            fs: 0,             // フルスクリーンボタンを非表示
            disablekb: 1,      // キーボード操作を無効化
            playsinline: 1,    // インライン再生を有効化
          },
        },
        () => {
          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;
      player.width(options.width || '100%');
      player.height(options.height || '100%');
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}