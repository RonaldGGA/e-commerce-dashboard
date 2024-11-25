import React, { Suspense } from "react";
import ColorForm from "./components/color-form";
import { prisma } from "@/lib/prismadb";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const { colorId } = params;
  const color = await prisma.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ColorForm initialData={color} />
        </Suspense>
      </div>
    </div>
  );
};

export default ColorPage;
