"use client";

import useWindowSize from "@/lib/hooks/use-window-size";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

export function AdminNav() {
    const { isMobile, isDesktop } = useWindowSize();

    const mobileMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/admin" passHref>
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/services" passHref>
                        Service Management
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/staffs" passHref>
                        Staff Management
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/popups" passHref>
                        Pop-Up Management
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/calendar" passHref>
                        Booking Calendar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/appointments" passHref>
                        Appointment Management
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin/breaks" passHref>
                        Break Management
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const desktopMenu = (
        <Menubar className="justify-center">
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin" passHref>
                        Dashboard
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/services" passHref>
                        Service Management
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/staffs" passHref>
                        Staff Management
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/popups" passHref>
                        Pop-up Management
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/calendar" passHref>
                        Booking Calendar
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/appointments" passHref>
                        Appointment Management
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-accent hover:text-accent-foreground">
                    <Link href="/admin/breaks" passHref>
                        Break Management
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    );

    // Based on window size, render the appropriate menu
    return (
        <>
            {isMobile && mobileMenu}
            {isDesktop && desktopMenu}
        </>
    );
}
export default AdminNav;
