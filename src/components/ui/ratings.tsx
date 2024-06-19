import { Star } from "lucide-react";

export default function Ratings({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-x-2">
      {new Array(5).fill(null).map((_, idx) => {
        if (idx < rating) {
          return <Star size={24} fill="gold" color="gold" />;
        }
        return <Star size={24} />;
      })}
    </div>
  );
}
