"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  _req: Request, //unused but necessary for params
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[GET-api-[storeId]-categories-[categoryId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }
    if (!name || !billboardId) {
      return new NextResponse("missing fields", { status: 400 });
    }
    if (!params.storeId || !params.categoryId) {
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

    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[PATCH-api-[storeId]-categories-[categoryId]]", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  _req: Request, //unused but necessary for params
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.categoryId) {
      return new NextResponse("Missing params", { status: 400 });
    }

    const deletedCategory = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log("[DELETE-api-[storeId]-categories-[categoryId]]", error);
    return new NextResponse("Internal server error");
  }
}
