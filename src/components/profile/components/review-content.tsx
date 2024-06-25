import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { StarRatings } from "~/components/profile/components/star-ratings";
import { type Review, type User } from "~/lib/types";

export default function ReviewContent({
  review,
  user,
}: {
  review: Review;
  user: User;
}) {
  return (
    <div className="flex w-full items-center">
      <div>
        <div className="mb-2 flex items-center">
          <Avatar>
            <AvatarImage src="/images/edm.jpg" alt="profile picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="ml-3 font-semibold">{user.name}</h1>
        </div>
        <StarRatings rating={review.rating} size={22} />
        <h4 className="mt-1 font-light text-gray-200">
          {review.reviewedAt.toDateString()}
        </h4>
        <h2 className="mt-4">{review.message}</h2>
      </div>
    </div>
  );
}
