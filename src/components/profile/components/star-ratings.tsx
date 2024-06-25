import { Star } from "lucide-react";

export async function StarRatings({
  rating,
  size,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex">
      {Array.from({ length: rating }).map((_, i) => (
        <Star
          key={i}
          size={size ?? 32}
          fill="gold"
          className="text-yellow-500"
        />
      ))}
    </div>
  );
}
