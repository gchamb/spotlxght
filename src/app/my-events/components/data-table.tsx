"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useState } from "react";
import CreateEventDialog from "~/components/create-event-dialog";

import DataTableComponent from "~/components/data-table";
import { DataTablePagination } from "~/components/data-table-pagination";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { MyEvents } from "~/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<MyEvents, TValue>[];
  data: MyEvents[];
}

export function DataTable({
  columns,
  data,
}: DataTableProps<MyEvents, unknown>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const uniqueStatuses = new Array(
    ...new Set(data.map((event) => event.status)),
  );

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex items-center justify-between">
        <Button variant="default" onClick={() => setShowCreateEventModal(true)}>
          Create Event
        </Button>
        <CreateEventDialog
          open={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {uniqueStatuses.map((status, idx) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={
                            table.getColumn("status")?.getFilterValue() ===
                            status
                          }
                          onCheckedChange={() => {
                            if (
                              table.getColumn("status")?.getFilterValue() ===
                              status
                            ) {
                              table.getColumn("status")?.setFilterValue(null);
                              return;
                            }

                            table.getColumn("status")?.setFilterValue(status);
                          }}
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTableComponent table={table} data={data} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
}
