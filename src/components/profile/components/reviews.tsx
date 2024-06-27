import { AzureBlobContainer, type Review, type User } from "~/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { StarRatings } from "~/components/profile/components/star-ratings";
import { getSasUrl } from "~/lib/azure";

export default async function Reviews({
  userReviews,
}: {
  userReviews: ({ review: Review } & { user: User })[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-8">
        {!userReviews.length ? (
          <div className="flex justify-center">
            <h1>No reviews yet.</h1>
          </div>
        ) : (
          <>
            {userReviews.map(async (userReview) => {
              const profilePictureSasUrl = userReview.user.profilePicImage
                ? (await getSasUrl(
                    userReview.user.profilePicImage,
                    "profile-pic",
                  )) || "/images/default-profile.png"
                : "/images/default-profile.png";

              return (
                <div
                  key={userReview.review.id}
                  className="flex gap-8 rounded-2xl bg-[#222222] p-10 drop-shadow-lg"
                >
                  <div className="flex w-full items-center">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Avatar>
                          <AvatarImage
                            src={profilePictureSasUrl}
                            alt="profile picture"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="ml-3 font-semibold">
                          {userReview.user.name}
                        </h1>
                      </div>
                      <StarRatings
                        rating={userReview.review.rating}
                        size={22}
                      />
                      <h4 className="mt-1 font-light text-gray-200">
                        {userReview.review.reviewedAt.toDateString()}
                      </h4>
                      <h2 className="mt-4">{userReview.review.message}</h2>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
