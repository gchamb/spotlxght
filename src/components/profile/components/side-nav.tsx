import { Suspense } from "react";
import LoadingReviews from "~/components/profile/components/loading-reviews";
import { type Asset, type Review, type User } from "~/lib/types";
import MusicPlayer from "~/components/profile/components/music-player";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { StarRatings } from "~/components/profile/components/star-ratings";

export default function SideNav({
  userId,
  userSongs,
  userReviews,
  isCurrentUser,
}: {
  userId: string;
  userSongs: (Asset & { sasUrl?: string })[];
  userReviews: (Review & { user: User })[];
  isCurrentUser: boolean;
}) {
  return (
    <div>
      <div className="sticky top-14">
        <div className="col-span-1 flex flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
          <div className="flex flex-col gap-4">
            {!userSongs.length && (
              <h1 className="text-center">No songs yet.</h1>
            )}
            {userSongs.map((asset) => (
              <MusicPlayer
                key={asset.id}
                asset={asset}
                userId={userId}
                isCurrentUser={isCurrentUser}
              />
            ))}
          </div>
        </div>
        <div className="hidden xl:block">
          <div className="col-span-1 mt-10 flex flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
            <h1 className="mb-8 text-center">Reviews</h1>
            {!userReviews.length && (
              <h1 className="text-center">No reviews yet.</h1>
            )}
            <div className="w-[350px]">
              <div className="mx-auto flex min-w-full flex-col gap-8">
                <Suspense fallback={<LoadingReviews />}>
                  {userReviews.map((review) => (
                    // <ReviewContent key={review.id} review={review} />
                    <div className="flex min-w-full items-center">
                      <div>
                        <div className="flex min-w-full items-start justify-start">
                          <Avatar>
                            <AvatarImage
                              src="/images/edm.jpg"
                              alt="profile picture"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex flex-col">
                            <h1 className="font-semibold">
                              {review.user.name}
                            </h1>
                            <div className="pt-1">
                              <StarRatings rating={review.rating} size={22} />
                            </div>
                          </div>
                        </div>
                        {/*<h4 className="min-w-[64px]2 text-right font-light text-gray-200">*/}
                        {/*  {review.reviewedAt.toDateString()}*/}
                        {/*</h4>*/}
                        <h2 className="mt-4">{review.message}</h2>
                      </div>
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
