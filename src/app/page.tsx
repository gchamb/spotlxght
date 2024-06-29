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
import { DataTable } from "~/app/listings/components/data-table";
import { getEventListings } from "~/lib/events";
import { columns } from "~/app/listings/components/columns";
import { Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import TimeslotsButton from "~/app/profile/components/timeslots-button";

const musicSamples = [
  {
    title: "rich bobby lee",
    blobKey: "",
  },
];

export default async function LandingPage() {
  const listings = await getEventListings();

  return (
    <>
      <div className="container flex flex-col gap-14 px-20">
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
        <h1 className="mt-10 text-center text-xl font-semibold text-slate-200">
          Our Musicians
        </h1>
        <div className="flex h-96 w-full gap-8 px-8">
          <div className="ice flex h-full w-full items-center justify-center">
            <Carousel className="w-full max-w-sm">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center">
                          <span className="text-4xl font-semibold">
                            {index + 1}
                          </span>
                          {/*<React.Fragment key={2}>*/}
                          {/*  <video*/}
                          {/*    className=""*/}
                          {/*    src="/public/videos/sample.mp4"*/}
                          {/*    controls={true}*/}
                          {/*  >*/}
                          {/*    <source src="/public/videos/sample.mp4" />*/}
                          {/*  </video>*/}
                          {/*</React.Fragment>*/}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="flex h-full w-full flex-col justify-center gap-2 px-14 py-10">
            <MusicPlayer
              title="rich bobby lee"
              sasUrl="public/music/funny.wav"
            />
            <MusicPlayer title="hey" />
            <MusicPlayer title="hey" />
            <MusicPlayer title="hey" />
            <MusicPlayer title="hey" />
            {/*<MusicPlayer />*/}
            {/*<MusicPlayer />*/}
          </div>
        </div>
        <div className="container mt-10">
          <h1 className="mb-10 text-center text-xl font-semibold text-slate-200">
            Available Events
          </h1>
          <DataTable columns={columns} data={listings} />
          <div className="mt-10">
            <div className="flex justify-between">
              <h3>Howl at the moon</h3>
              <h3>100 Main St Chicago, IL, 60605</h3>
              <TimeslotsButton event={event} />
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
