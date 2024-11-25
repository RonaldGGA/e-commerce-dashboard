import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { prisma } from "@/lib/prismadb";
import Navbar from "@/components/navbar";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return; // Added return for flow guarantee
  }

  if (params.storeId) {
    const store = await prisma.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });
    if (!store) {
      redirect("/");
      return; // Added return for flow guarantee
    }
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
