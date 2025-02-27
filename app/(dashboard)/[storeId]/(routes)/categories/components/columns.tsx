"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-actions";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.createdAt,
  },
  //This is the action button at the right
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
