import React from "react";
import { type Asset } from "~/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import VideoPlayer from "~/components/profile/components/video-player";

export default function MainContent({
  content,
}: {
  content: (Asset & { sasUrl?: string })[];
}) {
  return (
    <div className="flex flex-col gap-8">
      {!content.length && (
        <div className="flex justify-center">
          <h1>No posts yet.</h1>
        </div>
      )}
      {content.map((asset) => (
        <div key={asset.id} className="relative flex gap-6">
          <Avatar>
            <AvatarImage src="/images/edm.jpg" alt="profile picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              {/* TODO: Handle dynamic padding if no title/description */}
              <div className="my-1">
                <h1 className="font-semibold">{asset.title}</h1>
                <h2>{asset.description}</h2>
              </div>
            </div>
            <div className="mt-4">
              {/*<React.Fragment key={asset.id}>*/}
              {/*  <video controls={true}>*/}
              {/*    <source*/}
              {/*      key={asset.id}*/}
              {/*      src={asset.sasUrl}*/}
              {/*      type={asset.mimetype}*/}
              {/*    />*/}
              {/*  </video>*/}
              {/*</React.Fragment>*/}
              <VideoPlayer asset={asset} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
