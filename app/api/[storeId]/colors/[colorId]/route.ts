"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  _req: Request, //unused but necessary for params
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[GET-api-[storeId]-colors-[colorId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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
    if (!params.storeId || !params.colorId) {
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
    const color = await prisma.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[PATCH-api-[storeId]-colors-[colorId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.colorId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const deletedcolor = await prisma.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(deletedcolor);
  } catch (error) {
    console.log("[DELETE-api-[storeId]-colors-[colorId]]", error);
    return new NextResponse("Internal server error");
  }
}
