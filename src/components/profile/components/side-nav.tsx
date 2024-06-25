import { Suspense } from "react";
import LoadingReviews from "~/components/profile/components/loading-reviews";
import { type Asset, type Review, type User } from "~/lib/types";
import ReviewContent from "~/components/profile/components/review-content";
import MusicPlayer from "~/components/profile/components/music-player";

export default function SideNav({
  userSongs,
  userReviews,
  isCurrentUser,
}: {
  userSongs: (Asset & { sasUrl?: string })[];
  userReviews: (Review & { user: User })[];
  isCurrentUser: boolean;
}) {
  return (
    <div>
      <div className="sticky top-14">
        <div className="col-span-1 flex flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
          <div className="flex flex-col gap-4">
            {userSongs.map((asset) => (
              <MusicPlayer
                key={asset.id}
                asset={asset}
                isCurrentUser={isCurrentUser}
              />
            ))}
          </div>
        </div>
        <div className="col-span-1 mt-10 flex flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
          <h1 className="mb-8 text-center">Reviews</h1>
          <div className="flex w-full flex-col gap-8">
            <Suspense fallback={<LoadingReviews />}>
              {userReviews.map((review) => (
                <div key={review.id} className="w-[314px]">
                  <ReviewContent review={review} />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
