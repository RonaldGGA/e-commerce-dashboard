"use server";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import React from "react";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ThemeToggle } from "./themes-toogle";

const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <div className="h-16 border-b-2">
        <div className="flex items-center flex-row px-2 w-full h-full">
          <StoreSwitcher items={stores} />
          <MainNav className="mx-6" />
          <div className="ml-auto space-x-4 flex">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default Navbar;
