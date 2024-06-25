import ReviewContent from "~/components/profile/components/review-content";
import { type Review, type User } from "~/lib/types";

export default async function Reviews({
  userReviews,
}: {
  userReviews: ({ review: Review } & { user: User })[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-8">
        {!userReviews.length && (
          <div className="flex justify-center">
            <h1>No reviews yet.</h1>
          </div>
        )}
        {userReviews.map((userReview) => (
          <div
            key={userReview.review.id}
            className="flex gap-8 rounded-2xl bg-[#222222] p-10 drop-shadow-lg"
          >
            <ReviewContent review={userReview.review} user={userReview.user} />
          </div>
        ))}
      </div>
    </div>
  );
}
