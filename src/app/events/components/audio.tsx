"use client";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";

export default function Audio({
  src,
  mimetype,
}: {
  src: string;
  mimetype: string;
}) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative h-full max-h-[200px] w-full max-w-[200px]">
        <img
          className="h-full w-full "
          src="/images/default-profile.png"
          alt="default"
        />
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="outline"
            onClick={async () => {
              if (ref.current === null) return;
              try {
                if (playing) {
                  ref.current.pause();
                  setPlaying(false);
                } else {
                  await ref.current.play();
                  setPlaying(true);
                }
              } catch (err) {
                console.error(err);
              }
            }}
          >
            {playing ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
          </Button>
        </div>
      </div>

      <audio
        ref={(audioRef) => {
          if (!ref) return;
          ref.current = audioRef;
        }}
      >
        <source src={src} type={mimetype} />
      </audio>
    </div>
  );
}
