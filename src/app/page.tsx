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

const musicSamples = [
  {
    title: "space invaders",
    blobKey: "3227e3cf-7177-4a6f-9b38-3ae1a24001b5_file_example_WAV_2MG.wav",
  },
  {
    title: "space invaders part two",
    blobKey: "56b57c1f-7411-405e-9003-08558023ab4e_file_example_WAV_2MG.wav",
  },
  {
    title: "space invaders part three",
    blobKey: "db1ee8e3-bc34-4add-9c8d-aa2397fb6cb8_file_example_WAV_2MG.wav",
  },
];

const videoSamples = ["band.mp4", "carnival.mp4", "vinyl.mp4"];

export default async function LandingPage() {
  return (
    <>
      <div className="container flex flex-col gap-24 px-20">
        <div className="mt-20 flex h-[28rem] w-full gap-8">
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-slate-800 drop-shadow-lg">
            <img
              src="/images/venue.jpg"
              alt="venues"
              className="h-full w-full rounded-xl object-cover brightness-50"
            />
            <h1 className="absolute text-2xl font-bold">Venues</h1>
          </div>
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-slate-800 drop-shadow-lg">
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
          <div className="flex h-96 w-full gap-8 px-8">
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
                              <React.Fragment key={index}>
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
            <div className="flex h-full w-full flex-col justify-center gap-2 px-14 py-10">
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
        <div className="container mt-10 rounded-2xl bg-[#222] px-14 pb-14 pt-10 drop-shadow">
          <h1 className="mb-10 text-center text-xl font-semibold text-slate-200">
            Available Events
          </h1>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <Link
                href="/listings"
                className="group flex items-end justify-between rounded-2xl"
              >
                <h1 className="my-auto mr-4 w-fit">View Timeslots</h1>
                <MoveRight size={30} className="pt-[1px]" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <Link
                href="/listings"
                className="group flex items-end justify-between rounded-2xl"
              >
                <h1 className="my-auto mr-4 w-fit">View Timeslots</h1>
                <MoveRight size={30} className="pt-[1px]" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <Link
                href="/listings"
                className="group flex items-end justify-between rounded-2xl"
              >
                <h1 className="my-auto mr-4 w-fit">View Timeslots</h1>
                <MoveRight size={30} className="pt-[1px]" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <Link
                href="/listings"
                className="group flex items-end justify-between rounded-2xl"
              >
                <h1 className="my-auto mr-4 w-fit">View Timeslots</h1>
                <MoveRight size={30} className="pt-[1px]" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <Link
                href="/listings"
                className="group flex items-end justify-between rounded-2xl"
              >
                <h1 className="my-auto mr-4 w-fit">View Timeslots</h1>
                <MoveRight size={30} className="pt-[1px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-36 h-fit bg-spotlxght-dark-grey">
        <div className="container flex h-80 justify-center gap-8 px-28 py-14 text-slate-200">
          <div className="h-full w-full">
            <h1 className="text-2xl font-semibold">spotlxhgt</h1>
            <p className="my-2 text-sm font-normal text-slate-300">
              Copyright ©2024 All Rights Reversed
            </p>
            <div className="mt-8 flex justify-start gap-4">
              <Link href="#">
                <Twitter size={30} />
              </Link>
              <Link href="#">
                <Instagram size={30} />
              </Link>
            </div>
          </div>
          <div className="flex h-full w-full justify-start gap-16">
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
