"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const updatedStore = await prisma.store.updateMany({
      where: {
        userId,
        id: params.storeId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log("[STORE-PATCH]", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const deletedStore = await prisma.store.deleteMany({
      where: {
        userId,
        id: params.storeId,
      },
    });
    return NextResponse.json(deletedStore);
  } catch (error) {
    console.log("[STORE-DELETE]", error);
    return new NextResponse("Internal server error");
  }
}
