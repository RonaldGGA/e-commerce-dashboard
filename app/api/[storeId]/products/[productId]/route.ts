"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  _req: Request, //unused but necessary for params
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[GET-api-[storeId]-products-[productId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { productId, storeId } = params;
    const { userId } = await auth();
    const body = await request.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // Validate user authentication
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate required fields
    if (!name || !price || !categoryId || !colorId || !sizeId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Validate images array
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    // Validate store ID
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }
    // Check if store belongs to the user
    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the product in the database
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}, // Assuming you want to remove old images; handle this according to your requirements
        },
        storeId,
      },
    });
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    // Return the updated product
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PATCH-api-[storeId]-products-[productId]]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.productId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const deletedproduct = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(deletedproduct);
  } catch (error) {
    console.log("[DELETE-api-[storeId]-products-[productId]]", error);
    return new NextResponse("Internal server error");
  }
}
