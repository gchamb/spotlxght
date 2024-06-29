"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { CircleX, Filter } from "lucide-react";
import { useEffect, useState } from "react";

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

import { type MyBooking } from "~/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<MyBooking, TValue>[];
  data: MyBooking[];
}

export function DataTable({
  columns,
  data,
}: DataTableProps<MyBooking, unknown>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  useEffect(() => {
    console.log(columnFilters);
  }, [columnFilters]);

  const applicationStatuses = new Array(
    ...new Set(data.map((booking) => booking.application.status)),
  );

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex items-center justify-end gap-4">
        {columnFilters.length > 0 && (
          <button
            className="flex items-center gap-2 rounded-2xl border border-gray-200 py-1 pl-3 pr-4"
            onClick={() => table.resetColumnFilters()}
          >
            <CircleX size={20} />
            <p className="text-gray-200"> Clear filters</p>
          </button>
        )}
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
                    {applicationStatuses.map((status, idx) => {
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
