import React, { Suspense } from "react";
import SizeForm from "./components/size-form";
import { prisma } from "@/lib/prismadb";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const { sizeId } = params;
  const size = await prisma.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SizeForm initialData={size} />
        </Suspense>
      </div>
    </div>
  );
};

export default SizePage;
