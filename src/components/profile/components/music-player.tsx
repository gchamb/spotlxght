import { Play } from "lucide-react";
import { Slider } from "~/components/ui/slider";

export default function MusicPlayer({ songName }: { songName: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="w-30 h-30 block">
        <div className="w-30 h-30 relative">
          <button className="absolute top-1">
            <Play size={30} className="text-gray-100" />
          </button>
        </div>
      </div>
      <div className="w-[90%] pl-2">
        <h2 className="mb-4">{songName}</h2>
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          className="hover:cursor-pointer"
        />
      </div>
    </div>
  );
}
