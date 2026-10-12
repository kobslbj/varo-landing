"use client";

import { Toast } from "@heroui/react";

/** One toast region for the whole site; call `toast()` from any client component. */
export function Toaster() {
  return <Toast.Provider placement="bottom" />;
}
