import { type UserProfile } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Star } from "lucide-react";
import MusicPlayer from "~/components/profile/components/music-player";
import SkeletonWrapper from "~/components/profile/components/skeleton-wrapper";
import Post from "~/components/profile/components/post";

export default function MusicianProfile({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  return (
    <>
      <div className="flex h-96 flex-col rounded-2xl border bg-[#222222] shadow-xl">
        <div className="h-[50%] rounded-2xl bg-white">
          <img
            src="/images/default-banner.jpg"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
        <div className="container h-full">
          <div className="flex h-full justify-between py-10">
            <div className="container ">
              <p className="font-light">
                {userProfile.genres.map((g) => g.genre).join(", ")}
              </p>
              <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
              <p className="font-light text-[#eee]">{userProfile.address}</p>
            </div>
            <div className="container flex h-full flex-col items-end justify-between">
              <div className="flex h-full flex-col items-end justify-between">
                <div className="flex">
                  <Star size={32} fill="gold" className="text-yellow-500" />
                  <Star size={32} fill="gold" className="text-yellow-500" />
                  <Star size={32} fill="gold" className="text-yellow-500" />
                  <Star size={32} fill="gold" className="text-yellow-500" />
                  <Star size={32} fill="gold" className="text-yellow-500" />
                </div>
                <Button className="w-fit">Upload</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-16 grid grid-cols-3 gap-24">
        {/*TODO: Make these side-items sticky*/}
        <div className="sticky">
          <div className="col-span-1 flex flex-col rounded-2xl border bg-[#222222] p-10 shadow-xl">
            <div className="flex flex-col gap-8">
              <MusicPlayer songName="My song" />
              <MusicPlayer songName="My song" />
              <MusicPlayer songName="My song" />
              <MusicPlayer songName="My song" />
            </div>
          </div>
          <div className="col-span-1 mt-10 flex flex-col rounded-2xl border bg-[#222222] p-10 shadow-xl">
            <h1 className="mb-8 text-center">Reviews</h1>
            <div className="flex flex-col gap-8">
              {/*TODO: Add this to loading UI*/}
              {/*TODO: Add pagination & link to full review section*/}
              <SkeletonWrapper />
              <SkeletonWrapper />
              <SkeletonWrapper />
              <SkeletonWrapper />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-end gap-12 rounded-2xl pl-16">
          <Post
            title="Playing Guitar @ Jim's Bar"
            description="Had a great time jamming with Jimmy here!"
            image="/images/rock.jpg"
          />
          <Post
            title="Playing Guitar @ Jim's Bar"
            description="Had a great time jamming with Jimmy here!"
            image="/images/country.jpg"
          />
          <Post
            title="Playing Guitar @ Jim's Bar"
            description="Had a great time jamming with Jimmy here!"
            image="/images/hip hop.jpg"
          />
        </div>
      </div>
    </>
  );
}