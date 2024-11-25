"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  _req: Request, //unused but necessary for params
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[GET-api-[storeId]-sizes-[sizeId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }
    if (!name || !value) {
      return new NextResponse("missing fields", { status: 400 });
    }
    if (!params.storeId || !params.sizeId) {
      return new NextResponse("Missing params", { status: 400 });
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
    const size = await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[PATCH-api-[storeId]-sizes-[sizeId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.sizeId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const deletedSize = await prisma.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(deletedSize);
  } catch (error) {
    console.log("[DELETE-api-[storeId]-sizes-[sizeId]]", error);
    return new NextResponse("Internal server error");
  }
}
