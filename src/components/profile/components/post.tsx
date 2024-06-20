// TODO: get user info, post info (title/description)
import React from "react";
import { type Asset } from "~/lib/types";

export default function Post({
  asset,
}: {
  asset: Asset & { sasUrl?: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <img
        src="/images/edm.jpg"
        className="col-span-1 h-12 w-12 rounded-full bg-gray-200"
      />
      <div className="col-span-11">
        <div className="flex items-center space-x-4">
          {/* TODO: Handle dynamic padding if no title/description */}
          <div className="my-2">
            <h1 className="font-semibold">{asset.title}</h1>
            <h2>{asset.description}</h2>
          </div>
        </div>
        <div className="mt-4">
          <React.Fragment key={asset.id}>
            <video controls={true}>
              <source key={asset.id} src={asset.sasUrl} type={asset.mimetype} />
            </video>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}
