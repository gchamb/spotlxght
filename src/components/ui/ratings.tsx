import { Star } from "lucide-react";
import { type Rating } from "~/lib/types";

export default function Ratings({ rating }: { rating: Rating }) {
  return (
    <div className="flex items-center gap-x-2">
      {new Array(5).fill(null).map((_, idx) => {
        if (idx < rating) {
          return <Star key={idx} size={24} fill="gold" color="gold" />;
        }
        return <Star key={idx} size={24} />;
      })}
    </div>
  );
}
