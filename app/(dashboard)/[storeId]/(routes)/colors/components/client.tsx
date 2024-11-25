"use client";

import React from "react";
import Heading from "../../settings/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ColorClientProps {
  colors: ColorColumn[];
}

const ColorClient: React.FC<ColorClientProps> = ({ colors }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="pb-4 space-y-4">
      <div className=" flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colors} searchKey="name" />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityIdName="colorId" entityName="colors" />
    </div>
  );
};

export default ColorClient;
