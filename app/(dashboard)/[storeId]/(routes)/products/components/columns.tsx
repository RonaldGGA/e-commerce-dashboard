"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-actions";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  color: string;
  size: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
  //This is the action button at the right
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
