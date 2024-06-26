"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import Chip from "~/components/ui/chip";

import { EventListings } from "~/lib/types";
import Actions from "./actions";

export const columns: ColumnDef<EventListings>[] = [
  {
    accessorKey: "venueName",
    header: () => "Venue",
  },
  {
    accessorKey: "name",
    header: () => "Event",
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => {
      const genres = row.original.genres;
      return (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {genres.map((genre) => {
            return <Chip key={genre.id} text={genre.genre} randomColor />;
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Chip
          size="xs"
          text={status}
          color={
            status === "open"
              ? "gray"
              : status === "in-progress"
                ? "yellow"
                : status === "closed" || status === "completed"
                  ? "red"
                  : "gray"
          }
        />
      );
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Pay per Timeslot</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.date;

      return <div className="text-right font-medium">{date}</div>;
    },
  },
  {
    accessorKey: "totalTimeslots",
    header: "# of Timeslots",
    cell: ({ row }) => {
      const totalTimeslots = row.original.totalTimeslots;

      return <div className="text-right font-medium">{totalTimeslots}</div>;
    },
  },
  {
    accessorKey: "totalApplicants",
    header: "# of Applicants",
    cell: ({ row }) => {
      const totalApplicants = row.original.totalApplicants;

      return <div className="text-right font-medium">{totalApplicants}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const eventDetails = row.original;

      return <Actions eventDetails={eventDetails} />;
    },
  },
];
