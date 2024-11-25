"use client";

import React from "react";
import Heading from "../../settings/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps {
  billboards: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ billboards }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="pb-4 space-y-4">
      <div className=" flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage Billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} searchKey="label" />
      <Heading title="API" description="API calls for Billboards" />
      <Separator />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </div>
  );
};

export default BillboardClient;
