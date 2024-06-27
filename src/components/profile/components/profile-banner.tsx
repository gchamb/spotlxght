import { type UserProfile } from "~/lib/types";
import { getSasUrl } from "~/lib/azure";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";
import { getUserRating } from "~/lib/profile";
import CreateEventButton from "~/components/profile/components/create-event-button";
import UploadDialog from "~/components/profile/components/upload-dialog";
import Ratings from "~/components/ui/ratings";

export default async function ProfileBanner({
  userProfile,
  profilePictureSasUrl,
  isCurrentUser,
}: {
  userProfile: UserProfile;
  profilePictureSasUrl: string;
  isCurrentUser: boolean;
}) {
  const profileBannerSasUrl = userProfile.profileBannerImage
    ? (await getSasUrl(userProfile.profileBannerImage, "banner-pic")) ||
      "/images/default-banner.jpg"
    : "/images/default-banner.jpg";
  const userRating = await getUserRating(userProfile.id);

  return (
    <div className="relative flex h-fit flex-col rounded-2xl border bg-[#222222] shadow-xl sm:h-96">
      <div className="h-[50%] rounded-2xl bg-white">
        {/* TODO: Avoid banner picture flash */}
        <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
          <img
            src={profileBannerSasUrl}
            className="h-full w-full rounded-xl object-cover"
            alt="profile banner"
          />
        </Suspense>
      </div>
      <div className="container h-full">
        <div className="flex h-full flex-col justify-center py-10 sm:flex-row sm:justify-between">
          {userProfile.type === "musician" && (
            <>
              <div className="hidden min-w-48 md:block"></div>
              <div className="absolute bottom-0 top-0 my-auto hidden h-48 w-48 rounded-full bg-gray-100 md:block">
                <img
                  src={profilePictureSasUrl}
                  className="h-full w-full rounded-full object-fill p-1"
                  alt="profile picture"
                />
              </div>
            </>
          )}
          <div className="container text-center sm:text-left">
            <p className="font-light">
              {userProfile.genres.map((g) => g.genre).join(", ")}
            </p>
            <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
            <p className="font-light text-[#eee]">{userProfile.address}</p>
          </div>
          <div className="container flex h-full flex-col items-center justify-between sm:items-end">
            <div className="flex h-full flex-col items-center justify-between sm:items-end">
              <div className="my-4 sm:my-0">
                <Ratings rating={userRating} />
              </div>
              {isCurrentUser && userProfile.type === "venue" && (
                <CreateEventButton />
              )}
              {isCurrentUser && userProfile.type === "musician" && (
                <UploadDialog userId={userProfile.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
