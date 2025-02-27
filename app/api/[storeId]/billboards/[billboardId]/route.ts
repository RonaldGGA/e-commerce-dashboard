"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  _req: Request, //unused but necessary for params
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[GET-api-[storeId]-billboards-[billboardId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }
    if (!label || !imageUrl) {
      return new NextResponse("missing fields", { status: 400 });
    }
    if (!params.storeId || !params.billboardId) {
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
    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[PATCH-api-[storeId]-billboards-[billboardId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.billboardId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const deletedBillboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(deletedBillboard);
  } catch (error) {
    console.log("[DELETE-api-[storeId]-billboards-[billboardId]]", error);
    return new NextResponse("Internal server error");
  }
}
