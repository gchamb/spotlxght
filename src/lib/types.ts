import { z } from "zod";

export type Credentials = z.infer<typeof credentialsSchema>;

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  address: string | null;
  profilePicImage: string | null;
  profileBannerImage: string | null;
  type: UserType | null;
};

export type Genre = {
  id: string;
  genre: string;
  userId: string;
};

export type Review = {
  id: string;
  reviewer: string;
  message: string | null;
  reviewedAt: Date;
  rate: number;
  userId: string;
};

export type Asset = {
  id: string;
  title: string | null;
  description: string | null;
  azureBlobContainer: AzureBlobContainer;
  mimetype: string;
  azureBlobKey: string;
  uploadedAt: Date;
  userId: string;
};

export type UserProfile = {
  address: string | null;
  id: string;
  name: string | null;
  type: UserType | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  profilePicImage: string | null;
  profileBannerImage: string | null;
  reviews: Review[];
  assets: Asset[];
  genres: Genre[];
};

export type UserType = "venue" | "musician";

export type EventStatus = "open" | "in-progress" | "completed" | "closed";

export type ApplicationStatus = "requested" | "accepted" | "rejected";

export type GoogleInfo = {
  id: string;
  email: string;
  verified_emai: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];
export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp3",
];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/ogg", "video/webm"];

export enum AzureBlobContainer {
  PROFILE = "profile",
  BANNER = "banner",
  ASSET = "asset",
}

export const imageZodSchema = z
  .instanceof(File)
  .refine((file) => file !== null, "An upload is required.")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "The upload must be a maximum of 5MB.",
  )
  .refine((file) => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only JPG, JPEG, and PNG are allowed to be uploaded.")
  .nullable();

export const uploadFileFormSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title is required")
    .max(50, "Title should be at most 50 characters"),
  description: z
    .string()
    .max(100, "Description should be at most 100 characters")
    .nullish(),
  uploadItem: z
    .instanceof(File, { message: "An upload is required." })
    .refine((file) => file !== null, "An upload is required.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "The upload must be a maximum of 5MB.",
    )
    .refine((file) => {
      return [...ACCEPTED_AUDIO_TYPES, ...ACCEPTED_VIDEO_TYPES].includes(
        file.type,
      );
    }, "Only MP3, WAV, OGG, MP4, OGG, and WEBM files are allowed to be uploaded.")
    .nullable(),
});

export const venueFormSchema = z.object({
  venueName: z
    .string()
    .min(5, "Venue name should be at least 5 characters")
    .max(20, "Venue name should be at most 20 characters"),
  address: z.string().min(10, "Location should be at least 10 characters long"),
  bannerImage: imageZodSchema,
});

export const musicianFormSchema = z.object({
  name: z
    .string()
    .min(3, "Venue name should be at least 3 characters")
    .max(20, "Venue name should be at most 20 characters"),
  address: z
    .string()
    .min(10, "Address should be at least 10 characters long")
    .nullable(),
  profileImage: imageZodSchema,
  bannerImage: imageZodSchema,
});

export const credentialsSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
