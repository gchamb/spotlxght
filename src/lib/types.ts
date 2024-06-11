import { z } from "zod";

export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

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

export const venueFormSchema = z.object({
  venueName: z
    .string()
    .min(5, "Venue name should be at least 5 characters")
    .max(20, "Venue name should be at most 20 characters"),
  location: z
    .string()
    .min(10, "Location should be at least 10 characters long"),
  bannerImage: imageZodSchema,
});

export const musicianFormSchema = z.object({
  name: z
    .string()
    .min(5, "Venue name should be at least 5 characters")
    .max(20, "Venue name should be at most 20 characters"),
  location: z
    .string()
    .min(10, "Location should be at least 10 characters long"),
  profileImage: imageZodSchema,
  bannerImage: imageZodSchema,
});
