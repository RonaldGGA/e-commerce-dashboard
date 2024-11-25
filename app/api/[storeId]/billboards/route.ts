"use server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

/**Status codes
 * 401 - Unauthorized
 * 400 - Bad request
 * 403 - Forbidden
 */

export const POST = async (
  request: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unaunthenticated", { status: 401 });
    }
    if (!label || !imageUrl) {
      return new NextResponse("Missing fields", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[POST-api-[store-id]-billboard]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  request: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[GET-api-[store-id]-billboard]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
