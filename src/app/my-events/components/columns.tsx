"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import Chip from "~/components/ui/chip";

import { MyEvents } from "~/lib/types";

export const columns: ColumnDef<MyEvents>[] = [
  {
    accessorKey: "name",
    header: () => "Event Name",
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
                  ? "green"
                  : "red"
          }
        />
      );
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          //   className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const createdtAt = row.original.createdAt;

      return (
        <div className="text-right font-medium">
          {createdtAt.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const eventDetails = row.original;
      return (
        <div className="flex justify-end">
          <Link href={`/events/${eventDetails.id}`}>
            <Button className="flex items-center gap-x-2" variant="link">
              View Applicants
              <ArrowRight />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
