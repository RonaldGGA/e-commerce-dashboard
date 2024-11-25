"use client";

import React from "react";
import Heading from "../../settings/components/heading";

import { Separator } from "@/components/ui/separator";

import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  orders: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  return (
    <div className="pb-4 space-y-4">
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={orders} searchKey="products" />
    </div>
  );
};

export default OrderClient;
