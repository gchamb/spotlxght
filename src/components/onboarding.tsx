"use client";
import GenreSelector from "~/components/genre-selector";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { useState } from "react";
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
import { isVenueForm } from "~/lib/utils";

export default function Onboarding({ type }: { type: "venue" | "musician" }) {
  const [slide, setSlide] = useState<1 | 2 | 3>(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form =
    type === "venue"
      ? useForm<z.infer<typeof venueFormSchema>>({
          resolver: zodResolver(venueFormSchema),
          defaultValues: {
            venueName: "Your Venue Name",
            location: "100 Main Street, Chicago IL, 60605",
            bannerImage: null,
          },
        })
      : useForm<z.infer<typeof musicianFormSchema>>({
          resolver: zodResolver(musicianFormSchema),
          defaultValues: {
            name: "Your Name",
            location: "100 Main Street, Chicago IL, 60605",
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
      isVenueForm(form) &&
      values.venueName.trim().toLowerCase() ===
        form.formState.defaultValues?.venueName?.trim().toLowerCase() &&
      values.location.trim().toLowerCase() ===
        form.formState.defaultValues?.location?.toLowerCase()
    ) {
      form.setError("root", { message: "You can't submit the default values" });
      return;
    }

    if (
      !isVenue &&
      !isVenueForm(form) &&
      values.name.trim().toLowerCase() ===
        form.formState.defaultValues?.name?.trim().toLowerCase() &&
      values.location.trim().toLowerCase() ===
        form.formState.defaultValues?.location?.toLowerCase()
    ) {
      form.setError("root", { message: "You can't submit the default values" });
      return;
    }

    if (form.formState.errors.root?.message) {
      form.setError("root", { message: undefined });
    }

    const data = new FormData();
    data.set("type", type);
    data.set("location", values.location);

    if (values.bannerImage) {
      data.set("bannerImage", values.bannerImage);
    }

    // conditional set based on type
    if (isVenue) {
      data.set("venueName", values.venueName);
    } else if (values.profileImage) {
      data.set("profileImage", values.profileImage);
    }

    setLoading(true);
    try {
      await createProfile(data);
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
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
            onClick={() => setSlide(2)}
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
        <div className=" mx-auto flex max-w-md flex-col gap-y-24">
          <h1 className="3xl:text-5xl text-center text-3xl font-semibold">
            Complete Profile
          </h1>
          {isVenueForm(form) ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {form.formState.errors.root?.message && (
                  <p className="text-center text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="location"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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

                            form.setValue("bannerImage", file);
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
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Complete Profile
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {form.formState.errors.root?.message && (
                  <p className="text-center text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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

                            form.setValue("profileImage", file);
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
                  control={form.control}
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

                            form.setValue("bannerImage", file);
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
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Complete Profile
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className=" bg-underground-dark-grey flex hidden h-[700px] max-h-[700px] w-[900px] flex-col rounded-xl 2xl:block">
          <div className="h-[200px] w-full rounded-t-xl">
            {isVenueForm(form) && form.watch("bannerImage") ? (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src={URL.createObjectURL(form.watch("bannerImage")!)}
              />
            ) : !isVenueForm(form) && form.watch("bannerImage") ? (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src={URL.createObjectURL(form.watch("bannerImage")!)}
              />
            ) : (
              <img
                className="h-full w-full rounded-t-xl object-cover"
                src="/images/default-banner.jpg"
              />
            )}
          </div>

          <div className="flex">
            {type === "musician" && (
              <div className="h-[200px] w-[200px] p-4 ">
                {!isVenueForm(form) && form.watch("profileImage") ? (
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={URL.createObjectURL(form.watch("profileImage")!)}
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src="/images/default-profile2.png"
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
                  {isVenueForm(form)
                    ? form.watch("venueName")
                    : form.watch("name")}
                </h2>
                <span>
                  {isVenueForm(form)
                    ? form.watch("location")
                    : form.watch("location")}
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
        {/* <div className="justify-right mx-auto flex w-11/12 ">
          <Button
            onClick={() => setSlide(1)}
            variant="ghost"
            className="ml-auto flex items-center gap-x-4"
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
          <Button
            onClick={() => setSlide(3)}
            variant="ghost"
            className="ml-auto flex items-center gap-x-4"
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        </div> */}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-y-4">
      <h2>slide 3</h2>
    </div>
  );
}
