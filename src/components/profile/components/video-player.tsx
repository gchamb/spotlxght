"use client";

import { type Asset } from "~/lib/types";
import React from "react";

export default function VideoPlayer({
  asset,
}: {
  asset: Asset & { sasUrl?: string };
}) {
  // const videoRef = useRef() as MutableRefObject<HTMLVideoElement>;
  // const [controlsVisible, setControlsVisible] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [progress, setProgress] = useState(0);
  //
  // useEffect(() => {
  //   const handlePlay = async () => {
  //     if (isPlaying) {
  //       await videoRef.current.play();
  //     } else {
  //       videoRef.current.pause();
  //     }
  //   };
  //   handlePlay();
  // }, [isPlaying]);
  //
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentProgress =
  //       (videoRef.current.currentTime / videoRef.current.duration) * 100;
  //     if (currentProgress === 100) {
  //       setIsPlaying(false);
  //     }
  //     setProgress(currentProgress);
  //   }, 100);
  //
  //   return () => clearInterval(interval);
  // }, [isPlaying, progress]);

  // return (
  //   <div
  //     className="audio-player relative"
  //     onClick={() => {
  //       setIsPlaying((prev) => !prev);
  //       setProgress(
  //         (videoRef.current.currentTime / videoRef.current.duration) * 100,
  //       );
  //     }}
  //     onMouseEnter={() => setControlsVisible(true)}
  //     onMouseMove={() => setControlsVisible(true)}
  //     onMouseLeave={() => setControlsVisible(false)}
  //     onDoubleClick={() => videoRef.current.requestFullscreen()}
  //   >
  //     <React.Fragment key={asset.id}>
  //       <video ref={videoRef} src={asset.sasUrl}></video>
  //     </React.Fragment>
  //     {controlsVisible && (
  //       <div>
  //         <button>
  //           {isPlaying ? (
  //             <Pause
  //               size={80}
  //               className="absolute bottom-0 left-0 right-0 top-0 m-auto text-gray-100"
  //             />
  //           ) : (
  //             <Play
  //               size={80}
  //               className="absolute bottom-0 left-0 right-0 top-0 m-auto text-gray-100"
  //             />
  //           )}
  //         </button>
  //         <Slider
  //           defaultValue={[0]}
  //           value={[progress]}
  //           max={100}
  //           step={1}
  //           className="absolute bottom-10 left-0 right-0 mx-auto w-[95%] hover:cursor-pointer"
  //           draggable={true}
  //           onValueChange={(value) => {
  //             if (value[0] && videoRef.current) {
  //               videoRef.current.currentTime =
  //                 (value[0] / 100) * videoRef.current.duration;
  //             }
  //           }}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <video key={asset.id} controls={true}>
      <source key={asset.id} src={asset.sasUrl} type={asset.mimetype} />
    </video>
  );
}
