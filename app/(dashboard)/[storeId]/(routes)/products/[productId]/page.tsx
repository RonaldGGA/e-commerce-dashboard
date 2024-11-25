import React, { Suspense } from "react";
import ProductForm from "./components/product-form";
import { prisma } from "@/lib/prismadb";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const { productId } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });
  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductForm
            initialData={product}
            categories={categories}
            sizes={sizes}
            colors={colors}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductPage;
