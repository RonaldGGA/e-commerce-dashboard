import React, { Suspense } from "react";
import CategoryForm from "./components/category-form";
import { prisma } from "@/lib/prismadb";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const { categoryId, storeId } = params;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryForm billboards={billboards} initialData={category} />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryPage;
