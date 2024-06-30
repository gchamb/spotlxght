import { type Asset } from "~/lib/types";
import MusicPlayer from "~/app/profile/components/music-player";

export default function SideNav({
  userId,
  userSongs,
  isCurrentUser,
}: {
  userId: string;
  userSongs: (Asset & { sasUrl?: string })[];
  isCurrentUser: boolean;
}) {
  return (
    <div>
      <div className="sticky top-14">
        <div className="col-span-1 flex min-w-[350px] flex-col rounded-2xl border bg-[#222222] px-10 py-14 shadow-xl">
          <div className="flex flex-col gap-4">
            {userSongs.length > 0 ? (
              <>
                {userSongs.map((asset) => (
                  <MusicPlayer
                    key={asset.id}
                    asset={asset}
                    userId={userId}
                    isCurrentUser={isCurrentUser}
                  />
                ))}
              </>
            ) : (
              <h1 className="text-center">No songs yet.</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
