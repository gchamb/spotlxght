import { AzureBlobContainer, type UserProfile } from "~/lib/types";
import { getSasUrl } from "~/lib/azure";
import { Loader2 } from "lucide-react";
import UploadButton from "~/components/profile/components/upload-button";
import { Suspense } from "react";
import { StarRatings } from "~/components/profile/components/star-ratings";
import { getUserRating } from "~/lib/profile";

export default async function ProfileBanner({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const profileBannerSasUrl = userProfile.profileBannerImage
    ? (await getSasUrl(
        userProfile.profileBannerImage,
        AzureBlobContainer.PROFILE,
      )) ?? "/images/default-banner.jpg"
    : "/images/default-banner.jpg";
  const userRating = await getUserRating(userProfile.id);

  return (
    <div className="flex h-96 flex-col rounded-2xl border bg-[#222222] shadow-xl">
      <div className="h-[50%] rounded-2xl bg-white">
        {/* TODO */}
        <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
          <img
            src={profileBannerSasUrl}
            className="h-full w-full rounded-xl object-cover"
          />
        </Suspense>
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
              <StarRatings rating={userRating} />
              <UploadButton userProfile={userProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
