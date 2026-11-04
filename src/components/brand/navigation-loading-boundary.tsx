"use client";

import { Suspense, type ReactNode } from "react";
import { NavigationLoading } from "@/components/brand/navigation-loading";

/** useSearchParams requires a Suspense boundary in the App Router. */
export function NavigationLoadingBoundary({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationLoading />
      </Suspense>
      {children}
    </>
  );
}
