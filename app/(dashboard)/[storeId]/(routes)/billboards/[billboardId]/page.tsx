import React, { Suspense } from "react";
import BillboardForm from "./components/billboard-form";
import { prisma } from "@/lib/prismadb";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const { billboardId } = params;
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BillboardForm initialData={billboard} />
        </Suspense>
      </div>
    </div>
  );
};

export default BillboardPage;
