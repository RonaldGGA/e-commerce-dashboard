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
    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unaunthenticated", { status: 401 });
    }
    if (!name || !value) {
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
    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[POST-api-[store-id]-colors]", error);
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

    const colors = await prisma.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(colors);
  } catch (error) {
    console.log("[GET-api-[store-id]-colors]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
