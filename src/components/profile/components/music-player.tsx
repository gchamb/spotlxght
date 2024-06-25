"use client";

import { type Asset } from "~/lib/types";
import { Slider } from "~/components/ui/slider";
import { Pause, Play } from "lucide-react";
import React, {
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export default function MusicPlayer({
  asset,
  isCurrentUser,
}: {
  asset: Asset & { sasUrl?: string };
  isCurrentUser: boolean;
}) {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handlePlay = async () => {
      if (isPlaying) {
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    };
    handlePlay();
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      if (currentProgress === 100) {
        setIsPlaying(false);
      }
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  return (
    <div className="audio-player">
      <React.Fragment key={asset.id}>
        <audio ref={audioRef}>
          <source src={asset.sasUrl} />
        </audio>
      </React.Fragment>
      <div className="flex">
        <div className="w-30 h-30 block">
          <div className="w-30 h-30 relative">
            <button className="pt-7">
              {isPlaying ? (
                <Pause
                  onClick={() => {
                    setIsPlaying((prev) => !prev);
                    setProgress(
                      (audioRef.current.currentTime /
                        audioRef.current.duration) *
                        100,
                    );
                  }}
                  size={30}
                  className="text-gray-100"
                />
              ) : (
                <Play
                  onClick={() => {
                    setIsPlaying((prev) => !prev);
                    setProgress(
                      (audioRef.current.currentTime /
                        audioRef.current.duration) *
                        100,
                    );
                  }}
                  size={30}
                  className="text-gray-100"
                />
              )}
            </button>
          </div>
        </div>
        <div className="w-full pl-3 pr-2">
          <h2 className="mb-4">{asset.title}</h2>
          <Slider
            defaultValue={[0]}
            value={[progress]}
            max={100}
            step={1}
            className="hover:cursor-pointer"
            draggable={true}
            onValueChange={(value) => {
              if (value[0] && audioRef.current) {
                audioRef.current.currentTime =
                  (value[0] / 100) * audioRef.current.duration;
              }
            }}
          />
        </div>
        <h1 className="pt-7 text-gray-100">hi</h1>
      </div>
    </div>
  );
}
