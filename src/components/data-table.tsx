"use client";

import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  SortingState,
  VisibilityState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  teamId: number;
  stickyColumnId?: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  teamId,
  stickyColumnId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, _] = useState<VisibilityState>({
    team_id: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`${
                      stickyColumnId?.includes(header.column.id)
                        ? "sticky left-0 z-10 shadow-[inset_-2px_0_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_-2px_0_0_0_rgba(108,117,125,0.5)]"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      <ArrowUp
                        size={15}
                        className={cn(
                          "invisible transition-transform",
                          header.column.getIsSorted() === "asc" && "visible",
                          header.column.getIsSorted() === "desc" &&
                            "visible rotate-180",
                        )}
                      />
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  row.getValue("team_id") == teamId &&
                    "bg-primary dark:bg-primary md:dark:bg-primary/40",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${
                      stickyColumnId?.includes(cell.column.id ?? "")
                        ? "sticky left-0 z-10 shadow-[inset_-2px_0_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_-2px_0_0_0_rgba(108,117,125,0.5)]"
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
