"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DataTableComponent from "~/components/data-table";
import { DataTablePagination } from "~/components/data-table-pagination";


import { EventListings } from "~/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<EventListings, TValue>[];
  data: EventListings[];
}

export function DataTable({
  columns,
  data,
}: DataTableProps<EventListings[], unknown>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const uniqueGenres = useMemo(() => {
    const genres = data
      .map((listing) => {
        return listing.genres.map((genre) => genre.genre);
      })
      .flat();

    return new Array(...new Set(genres));
  }, [data]);

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

  return (
    <div className="flex flex-col gap-y-10">
      {/* <div className="flex items-center justify-between">
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
                  <span>Genres</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {uniqueGenres.map((genre, idx) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={true}
                          onCheckedChange={() => {
                            setGenre(genre);
                          }}
                        >
                          {genre}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <DataTableComponent table={table} data={data} columns={columns} />
      <DataTablePagination table={table} />
    </div>
  );
}
