import { type Asset } from "~/lib/types";
import React from "react";

export default function MusicPlayer({
  asset,
}: {
  asset: Asset & { sasUrl?: string };
}) {
  return (
    <div className="mx-auto flex items-center justify-between">
      {/*<div className="w-30 h-30 block">*/}
      {/*  <div className="w-30 h-30 relative">*/}
      {/*    <button className="absolute top-1">*/}
      {/*      <Play size={30} className="text-gray-100" />*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <React.Fragment key={asset.id}>
        <audio controls={true}>
          <source key={asset.id} src={asset.sasUrl} />
        </audio>
      </React.Fragment>
      {/*<div className="w-[90%] pl-2">*/}
      {/*  <h2 className="mb-4">{asset.sasUrl}</h2>*/}
      {/*  <Slider*/}
      {/*    defaultValue={[0]}*/}
      {/*    max={100}*/}
      {/*    step={1}*/}
      {/*    className="hover:cursor-pointer"*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
}
