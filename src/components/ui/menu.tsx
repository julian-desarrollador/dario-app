"use client";

import { Menu } from "@base-ui/react/menu";
import type { ReactNode } from "react";

export function ActionMenu({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger className="rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-[var(--ink)]/12">
        {label}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} className="z-40">
          <Menu.Popup className="min-w-40 rounded-xl bg-white p-1 shadow-lg ring-1 ring-[var(--ink)]/10">
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function ActionMenuItem({
  children,
  onClick,
  destructive,
}: {
  children: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Menu.Item
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-[var(--mist)] ${
        destructive ? "text-[var(--alert)]" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Menu.Item>
  );
}
