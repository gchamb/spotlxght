/* eslint-disable @next/next/no-img-element */
"use client";
import GenreSelector from "~/components/genre-selector";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { musicianFormSchema, venueFormSchema } from "~/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createProfile } from "~/server/actions/onboarding-actions";
import { shortenOrNot } from "~/lib/utils";
import { toast } from "sonner";
import LinkStripe from "./link-stripe";

export default function Onboarding({ type }: { type: "venue" | "musician" }) {
  const [slide, setSlide] = useState<1 | 2 | 3>(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const venueForm = useForm<z.infer<typeof venueFormSchema>>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      venueName: "Your Venue Name",
      address: "100 Main Street, Chicago IL, 60605",
      bannerImage: null,
    },
  });
  const musicianForm = useForm<z.infer<typeof musicianFormSchema>>({
    resolver: zodResolver(musicianFormSchema),
    defaultValues: {
      name: "Your Name",
      address: null,
      bannerImage: null,
      profileImage: null,
    },
  });

  const onSubmit = async (
    values:
      | z.infer<typeof venueFormSchema>
      | z.infer<typeof musicianFormSchema>,
  ) => {
    // make sure the user isn't using the default values
    const isVenue = "venueName" in values;
    if (
      isVenue &&
      values.venueName.trim().toLowerCase() ===
        venueForm.formState.defaultValues?.venueName?.trim().toLowerCase() &&
      values.address.trim().toLowerCase() ===
        venueForm.formState.defaultValues?.address?.toLowerCase()
    ) {
      venueForm.setError("root", {
        message: "You can't submit the default values",
      });
      return;
    }

    if (
      !isVenue &&
      values.name.trim().toLowerCase() ===
        musicianForm.formState.defaultValues?.name?.trim().toLowerCase()
    ) {
      musicianForm.setError("root", {
        message: "You can't submit the default values",
      });
      return;
    }

    // resets the root error if there was one present
    if (
      musicianForm.formState.errors.root?.message ??
      venueForm.formState.errors.root?.message
    ) {
      venueForm.setError("root", { message: undefined });
      musicianForm.setError("root", { message: undefined });
    }

    const data = new FormData();
    data.set("type", type);
    data.set("genres", selectedGenres.join(","));

    if (values.address) {
      data.set("address", values?.address);
    }

    if (values.bannerImage) {
      data.set("bannerImage", values.bannerImage);
    }

    // conditional set based on type
    if (isVenue) {
      data.set("venueName", values.venueName);
    } else {
      data.set("name", values.name);

      if (values.profileImage) {
        data.set("profileImage", values.profileImage);
      }
    }

    try {
      startTransition(async () => {
        await createProfile(data);

        if (type === "musician") {
          setSlide(3);
        }
      });
    } catch (err) {
      if (isVenue) {
        venueForm.setError("root", {
          message: err instanceof Error ? err.message : String(err),
        });
      } else {
        musicianForm.setError("root", {
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  };

  if (slide === 1) {
    return (
      <div className="3xl:gap-y-4 flex h-full flex-col justify-center">
        <GenreSelector
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
        <div className="justify-right mx-auto flex w-11/12 ">
          <Button
            onClick={() => {
              if (selectedGenres.length === 0) {
                toast("You need to select at least one genre.");
                return;
              }

              setSlide(2);
            }}
            variant="ghost"
            className="ml-auto flex items-center gap-x-4"
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  if (slide === 2) {
    return (
      <div className="max-screen-xl  3xl:w-3/4 mx-auto flex h-full items-center gap-x-48  p-4 ">
        <div className=" 3xl:gap-y-24 mx-auto flex max-w-md flex-col gap-y-8">
          <h1 className="3xl:text-5xl text-center text-3xl font-semibold">
            Complete Profile
          </h1>
          {type === "venue" ? (
            <Form {...venueForm}>
              <form
                onSubmit={venueForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {venueForm.formState.errors.root?.message && (
                  <p className="text-center text-sm text-red-600">
                    {venueForm.formState.errors.root.message}
                  </p>
                )}
                <FormField
                  control={venueForm.control}
                  name="venueName"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Name</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={venueForm.control}
                  name="address"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={venueForm.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white text-black"
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const { files } = e.currentTarget;
                            if (files === null) {
                              return;
                            }

                            const [file] = files;

                            if (file === undefined) {
                              return;
                            }

                            venueForm.setValue("bannerImage", file);
                          }}
                          ref={field.ref}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>5MB Upload Limit</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="flex h-[75px] w-full items-center gap-x-2 text-2xl font-semibold"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Complete Profile
                </Button>
                <Button
                  className="w-full "
                  variant="ghost"
                  type="button"
                  disabled={isPending}
                  onClick={() => setSlide(1)}
                >
                  Back
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...musicianForm}>
              <form
                onSubmit={musicianForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {musicianForm.formState.errors.root?.message && (
                  <p className="text-center text-sm text-red-600">
                    {musicianForm.formState.errors.root.message}
                  </p>
                )}
                <FormField
                  control={musicianForm.control}
                  name="name"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={musicianForm.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white text-black"
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const { files } = e.currentTarget;
                            if (files === null) {
                              return;
                            }

                            const [file] = files;

                            if (file === undefined) {
                              return;
                            }

                            musicianForm.setValue("profileImage", file);
                          }}
                          ref={field.ref}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>5MB Upload Limit</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={musicianForm.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white text-black"
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const { files } = e.currentTarget;
                            if (files === null) {
                              return;
                            }

                            const [file] = files;

                            if (file === undefined) {
                              return;
                            }

                            musicianForm.setValue("bannerImage", file);
                          }}
                          ref={field.ref}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>5MB Upload Limit</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="flex h-[75px] w-full items-center gap-x-2 text-2xl font-semibold"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Complete Profile
                </Button>

                <Button
                  className="w-full"
                  variant="ghost"
                  type="button"
                  disabled={isPending}
                  onClick={() => setSlide(1)}
                >
                  Back
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className=" flex hidden h-[650px] max-h-[700px] w-[900px] flex-col rounded-xl bg-underground-dark-grey 2xl:block">
          <div className="h-[200px] w-full rounded-t-xl">
            {type === "venue" && venueForm.watch("bannerImage") ? (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src={URL.createObjectURL(venueForm.watch("bannerImage")!)}
                alt="venue banner"
              />
            ) : type === "musician" && musicianForm.watch("bannerImage") ? (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src={URL.createObjectURL(musicianForm.watch("bannerImage")!)}
                alt="musician banner"
              />
            ) : (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src="/images/default-banner.jpg"
                alt="default banner"
              />
            )}
          </div>

          <div className="flex">
            {type === "musician" && (
              <div className="h-[200px] w-[200px] p-4 ">
                {type === "musician" && musicianForm.watch("profileImage") ? (
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={URL.createObjectURL(
                      musicianForm.watch("profileImage")!,
                    )}
                    alt="profile image"
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src="/images/default-profile2.png"
                    alt="default profile image"
                  />
                )}
              </div>
            )}
            <div
              className={`flex ${type === "musician" ? "w-3/4" : "w-full"} items-center justify-between p-4`}
            >
              <div>
                <div className="flex gap-x-4">
                  {selectedGenres.map((genre) => {
                    return (
                      <span className="text-sm" key={genre}>
                        {genre}
                      </span>
                    );
                  })}
                </div>
                <h2 className="text-4xl font-semibold">
                  {type === "venue"
                    ? shortenOrNot(venueForm.watch("venueName"))
                    : shortenOrNot(musicianForm.watch("name"), 20)}
                </h2>
                <span>
                  {type === "venue"
                    ? shortenOrNot(venueForm.watch("address"), 50)
                    : // hard code this for now
                      "100 Main Street, Chicago IL, 60605"}
                </span>
              </div>
              <div className="flex gap-x-2">
                <Star size={32} fill="gold" className="text-yellow-500" />
                <Star size={32} fill="gold" className="text-yellow-500" />
                <Star size={32} fill="gold" className="text-yellow-500" />
                <Star size={32} fill="gold" className="text-yellow-500" />
                <Star size={32} fill="gold" className="text-yellow-500" />
              </div>
            </div>
          </div>

          {type === "venue" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-y-8">
              <div className="flex justify-center">
                <Button variant="ghost">Events</Button>
                <Button variant="ghost">Reviews</Button>
              </div>
              <div className="flex justify-center gap-x-4">
                <div className="flex h-[150px] w-[200px] flex-col rounded-lg bg-white p-2">
                  <h2 className="max-w-lg text-4xl font-bold text-black">
                    Jazz Night
                  </h2>
                  <div className="ml-auto mt-auto flex items-center gap-x-2">
                    <span className="text-black">Timeslots</span>
                    <ArrowRight className="text-black" />
                  </div>
                </div>
                <div className="flex h-[150px] w-[200px] flex-col rounded-lg bg-white p-2">
                  <h2 className="max-w-lg text-4xl font-bold text-black">
                    Jazz Night
                  </h2>
                  <div className="ml-auto mt-auto flex items-center gap-x-2">
                    <span className="text-black">Timeslots</span>
                    <ArrowRight className="text-black" />
                  </div>
                </div>
                <div className="flex h-[150px] w-[200px] flex-col rounded-lg bg-white p-2">
                  <h2 className="max-w-lg text-4xl font-bold text-black">
                    Jazz Night
                  </h2>
                  <div className="ml-auto mt-auto flex items-center gap-x-2">
                    <span className="text-black">Timeslots</span>
                    <ArrowRight className="text-black" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <LinkStripe />;
}
