"use client";

import React, { useEffect, useState } from "react";

import { ClerkProvider as Clerk } from "@clerk/nextjs";

const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return null;
  }

  return <Clerk afterSignOutUrl={"/"}>{children}</Clerk>;
};

export default ClerkProvider;
