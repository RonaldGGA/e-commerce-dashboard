import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export const POST = async (request: Request) => {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { name } = body;
    if (!userId || !name) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const store = await prisma.store.create({
      data: {
        userId,
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[api/form]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
