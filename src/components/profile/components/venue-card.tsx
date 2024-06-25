"use client";

import { MoveRight } from "lucide-react";
import { useState } from "react";

export default function VenueCard({ title }: { title: string }) {
  const [timeslotHovered, setTimeslotHovered] = useState(false);

  return (
    <div className="mx-auto h-64 w-72 rounded-2xl bg-[#222222] shadow-2xl sm:w-80">
      <div className="container flex h-full flex-col justify-between gap-8 py-10">
        <div className="flex justify-between gap-12">
          <h1 className="w-fit text-2xl">{title}</h1>
          <h1 className="w-fit pt-1 text-2xl font-bold">$50</h1>
        </div>
        <div
          onMouseEnter={() => setTimeslotHovered(true)}
          onMouseLeave={() => setTimeslotHovered(false)}
          className="group flex justify-between rounded-2xl py-4 hover:cursor-pointer"
        >
          <h1 className="my-auto w-fit group-hover:font-bold">Timeslots</h1>
          <MoveRight
            size={timeslotHovered ? 35 : 30}
            className="w-fit group-hover:font-bold"
          />
        </div>
      </div>
    </div>
  );
}
