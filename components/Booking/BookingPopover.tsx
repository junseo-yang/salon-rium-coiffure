"use client";

import { Dispatch, SetStateAction, ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export default function BookingPopover({
    children,
    content,
    align = "center",
    openPopover,
    setOpenPopover
}: {
    children: ReactNode;
    content: ReactNode | string;
    align?: "center" | "start" | "end";
    openPopover: boolean;
    setOpenPopover: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <>
            <PopoverPrimitive.Root
                open={openPopover}
                onOpenChange={(isOpen) => setOpenPopover(isOpen)}
            >
                <PopoverPrimitive.Trigger className="inline-flex" asChild>
                    {children}
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content
                    sideOffset={4}
                    align={align}
                    className="z-20 animate-slide-up-fade items-center rounded-md border border-gray-200 bg-white drop-shadow-lg dark:bg-black dark:text-gray-400"
                >
                    {content}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Root>
        </>
    );
}
