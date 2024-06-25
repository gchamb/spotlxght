"use client";

import React from "react";
import { type Asset, UserProfile } from "~/lib/types";
import MusicianContent from "~/components/profile/components/musician-content";
import VenueContent from "~/components/profile/components/venue-content";

export default function MainContent({
  content,
  userProfile,
  isCurrentUser,
}: {
  content?: (Asset & { sasUrl?: string })[];
  userProfile: UserProfile;
  isCurrentUser: boolean;
}) {
  if (userProfile.type === "venue") {
    return <VenueContent />;
  } else {
    return (
      <MusicianContent
        content={content!}
        userProfile={userProfile}
        isCurrentUser={isCurrentUser}
      />
    );
  }
}
