"use client";

import { type Asset } from "~/lib/types";
import { Slider } from "~/components/ui/slider";
import { MoreHorizontal, Pause, Play } from "lucide-react";
import React, {
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { deleteAsset } from "~/server/actions/profile";
import { toast } from "sonner";

export default function MusicPlayer({
  asset,
  userId,
  isCurrentUser,
  title,
  sasUrl,
}: {
  asset?: Asset & { sasUrl?: string };
  userId?: string;
  isCurrentUser?: boolean;
  title?: string;
  sasUrl?: string;
}) {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handlePlay = async () => {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      );
      if (isPlaying) {
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    };
    handlePlay().catch((err) => console.error(err));
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
    <div>
      <React.Fragment key={asset?.id}>
        <audio ref={audioRef}>
          <source src={asset?.sasUrl ?? sasUrl} />
        </audio>
      </React.Fragment>
      <div className="flex">
        <div className="w-30 h-30 block">
          <div className="w-30 h-30 relative">
            <div className="pr-4 pt-7">
              <button
                onClick={() => {
                  setIsPlaying((prev) => !prev);
                }}
              >
                {isPlaying ? (
                  <Pause size={30} className="text-gray-100" />
                ) : (
                  <Play size={30} className="text-gray-100" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full pl-3 pr-2">
          <h2 className="mb-4">{asset?.title ?? title}</h2>
          <Slider
            defaultValue={[0]}
            value={[progress]}
            max={100}
            step={1}
            className="w-11/12 hover:cursor-pointer sm:w-full"
            draggable={true}
            onValueChange={(value) => {
              if (value[0] && audioRef) {
                audioRef.current.currentTime =
                  (value[0] / 100) * audioRef.current.duration;
              }
            }}
          />
        </div>
        {isCurrentUser && (
          <div className="pt-7">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/*<DropdownMenuLabel>Actions</DropdownMenuLabel>*/}
                {/*<DropdownMenuItem*/}
                {/*  onClick={() => navigator.clipboard.writeText("hi")}*/}
                {/*>*/}
                {/*  Copy payment ID*/}
                {/*</DropdownMenuItem>*/}
                {/*<DropdownMenuSeparator />*/}
                {/*<DropdownMenuItem>Edit</DropdownMenuItem>*/}
                {/*<DropdownMenuItem>*/}
                {/*  <AlertDialog>*/}
                {/*    <AlertDialogTrigger asChild>*/}
                {/*      <p className="h-full w-full text-red-600">Delete</p>*/}
                {/*    </AlertDialogTrigger>*/}
                {/*    <AlertDialogContent>*/}
                {/*      <AlertDialogHeader>*/}
                {/*        <AlertDialogTitle>*/}
                {/*          Are you absolutely sure?*/}
                {/*        </AlertDialogTitle>*/}
                {/*        <AlertDialogDescription>*/}
                {/*          This action cannot be undone. This will permanently*/}
                {/*          delete your account and remove your data from our*/}
                {/*          servers.*/}
                {/*        </AlertDialogDescription>*/}
                {/*      </AlertDialogHeader>*/}
                {/*      <AlertDialogFooter>*/}
                {/*        <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
                {/*        <AlertDialogAction>Continue</AlertDialogAction>*/}
                {/*      </AlertDialogFooter>*/}
                {/*    </AlertDialogContent>*/}
                {/*  </AlertDialog>*/}
                {/*</DropdownMenuItem>*/}
                {userId && (
                  <DropdownMenuItem
                    onClick={async () => {
                      const error =
                        asset?.id && (await deleteAsset(asset.id, userId));

                      if (error) {
                        toast(error.message);
                      }
                    }}
                  >
                    <p className="font-bold text-red-600">Delete</p>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
