import React from "react";
import MusicPlayer from "~/app/profile/components/music-player";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Instagram, MoveRight, Twitter } from "lucide-react";
import Link from "next/link";
import { getSasUrl } from "~/lib/azure";

export const revalidate = 3000;

const musicSamples = [
  {
    title: "Electric Soul",
    blobKey: "powerful-electric-guitar.wav",
  },
  {
    title: "No Limit",
    blobKey: "no-limit.wav",
  },
  {
    title: "Higher",
    blobKey: "edm-drop.wav",
  },
  {
    title: "Wavering",
    blobKey: "alternative-pop-guitar.wav",
  },
];

const videoSamples = [
  "hard-rock-edit.mp4",
  "light-show-edit.mp4",
  "on-stage.mp4",
];

const listingSamples = [
  {
    title: "Howl at the moon",
    location: "100 Main St Chicago, IL, 60605",
  },
  {
    title: "Howl at the moon",
    location: "100 Main St Chicago, IL, 60605",
  },
  {
    title: "Howl at the moon",
    location: "100 Main St Chicago, IL, 60605",
  },
  {
    title: "Howl at the moon",
    location: "100 Main St Chicago, IL, 60605",
  },
  {
    title: "Howl at the moon",
    location: "100 Main St Chicago, IL, 60605",
  },
];

export default async function LandingPage() {
  return (
    <>
      <div className="px-8/ container flex flex-col gap-24 lg:px-20">
        <div className="mt-20 flex min-h-[28rem] w-full flex-col gap-8 lg:flex-row">
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl drop-shadow-lg">
            <img
              src="/images/venue.jpg"
              alt="venues"
              className="h-full w-full rounded-xl object-cover brightness-50"
            />
            <h1 className="absolute text-2xl font-bold">Venues</h1>
          </div>
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl drop-shadow-lg">
            <img
              src="/images/rock.jpg"
              alt="musicians"
              className="h-full w-full rounded-xl object-cover brightness-50"
            />
            <h1 className="absolute text-2xl font-bold">Musicians</h1>
          </div>
        </div>
        <section>
          <h1 className="mb-14 mt-10 text-center text-xl font-semibold text-slate-200">
            Our Musicians
          </h1>
          <div className="flex min-h-96 w-full flex-col items-center gap-8 px-8 lg:flex-row">
            <div className="flex h-full w-full items-center justify-center">
              <Carousel className="w-full max-w-sm">
                <CarouselContent>
                  {Array.from({ length: 3 }).map(async (_, index) => {
                    const sasUrl = await getSasUrl(
                      videoSamples[index]!,
                      "assets",
                    );

                    return (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center">
                              <React.Fragment key={sasUrl}>
                                <video
                                  controls={true}
                                  className="h-full w-full rounded-lg object-cover"
                                >
                                  <source src={sasUrl} />
                                </video>
                              </React.Fragment>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex h-full w-full flex-col justify-center gap-2 py-10 md:px-14">
              {musicSamples.map(async (sample) => {
                const sasUrl = await getSasUrl(sample.blobKey, "assets");
                return (
                  <MusicPlayer
                    key={sample.blobKey}
                    title={sample.title}
                    sasUrl={sasUrl}
                  />
                );
              })}
            </div>
          </div>
        </section>
        <div className="container rounded-2xl bg-[#222] px-14 pb-14 pt-10 drop-shadow md:mt-10">
          <h1 className="mb-10 text-center text-xl font-semibold text-slate-200">
            Available Events
          </h1>
          <div className="mt-10 flex flex-col gap-10 lg:gap-4">
            {listingSamples.map((listing, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between text-left md:flex-row lg:text-center"
              >
                <h3>Howl at the moon</h3>
                <h3>100 Main St Chicago, IL, 60605</h3>
                <Link
                  href="/listings"
                  className="group flex items-end justify-between rounded-2xl"
                >
                  <h1 className="my-auto mr-4 mt-2 w-fit lg:mt-0">
                    View Timeslots
                  </h1>
                  <MoveRight size={30} className="pt-[1px]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="mt-36 h-fit bg-spotlxght-dark-grey">
        <div className="container flex min-h-80 flex-col justify-center gap-8 px-10 py-14 text-slate-200 md:flex-row md:px-28">
          <div className="h-full w-full text-center md:text-left">
            <h1 className="text-2xl font-semibold">spotlxhgt</h1>
            <p className="my-2 text-sm font-normal text-slate-300">
              Copyright ©2024 All Rights Reversed
            </p>
            <div className="mx-auto mt-8 flex justify-center gap-4 md:justify-start">
              <Link href="#">
                <Twitter size={30} />
              </Link>
              <Link href="#">
                <Instagram size={30} />
              </Link>
            </div>
          </div>
          <div className="flex h-full w-full justify-center gap-16 md:justify-start">
            <div className="flex h-full w-24 flex-col gap-4 text-center text-slate-200">
              <h2 className="font-semibold">Company</h2>
              <Link href="#" className="text-xs text-slate-300">
                About us
              </Link>
              <Link href="#" className="text-xs text-slate-300">
                Mission
              </Link>
              <Link href="#" className="text-xs text-slate-300">
                Pricing
              </Link>
              <Link href="#" className="text-xs text-slate-300">
                Contact us
              </Link>
            </div>
            <div className="flex h-full w-24 flex-col gap-4 text-center text-slate-200">
              <h2 className="font-semibold">Legal</h2>
              <Link href="#" className="text-xs text-slate-300">
                Terms of service
              </Link>
              <Link href="#" className="text-xs text-slate-300">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
