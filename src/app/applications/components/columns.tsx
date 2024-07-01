"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import Chip from "~/components/ui/chip";

import { type MyBooking } from "~/lib/types";

export const columns: ColumnDef<MyBooking>[] = [
  {
    accessorKey: "user.name",
    id: "venueName",
    header: () => "Venue Name",
  },
  {
    accessorKey: "event.name",
    id: "name",
    header: () => "Event Name",
  },
  {
    accessorKey: "application.status",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.application.status;
      return (
        <Chip
          size="xs"
          text={status}
          color={
            status === "accepted"
              ? "green"
              : status === "requested"
                ? "gray"
                : status === "rejected"
                  ? "red"
                  : "gray"
          }
        />
      );
    },
  },
  {
    accessorKey: "event.amount",
    id: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.event.amount.toString());
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "application.appliedAt",
    id: "appliedAt",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Application Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const appliedAt = row.original.application.appliedAt;

      return (
        <div className="pr-4 text-right font-medium">
          {appliedAt.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "event.date",
    id: "eventData",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const eventDate = row.original.event.date;
      console.log(eventDate);

      return <div className="pr-4 text-right font-medium">{eventDate}</div>;
    },
  },
  {
    accessorKey: "timeslot.startTime",
    id: "startTime",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.original.timeslot.startTime;

      return (
        <div className="pr-4 text-right font-medium">{`${startTime.slice(0, -2)} ${startTime.slice(-2)}`}</div>
      );
    },
  },
  {
    accessorKey: "timeslot.endTime",
    id: "endTime",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const endTime = row.original.timeslot.endTime;

      return (
        <div className="pr-4 text-right font-medium">{`${endTime.slice(0, -2)} ${endTime.slice(-2)}`}</div>
      );
    },
  },
];
