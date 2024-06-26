import { type Asset, type Review, type User } from "~/lib/types";
import MusicPlayer from "~/components/profile/components/music-player";

export default function SideNav({
  userId,
  userSongs,
  userReviews,
  isCurrentUser,
}: {
  userId: string;
  userSongs: (Asset & { sasUrl?: string })[];
  userReviews: ({ review: Review } & { user: User })[];
  isCurrentUser: boolean;
}) {
  return (
    <div>
      <div className="sticky top-14">
        <div className="col-span-1 flex w-[350px] flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
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
      </div>
    </div>
  );
}
