"use client";

import { useState } from "react";
import type { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";

const navbarItems = [
    { ref: "/book-now", label: "Book Now" },
    { ref: "/account/my-account", label: "Account", prefetch: false }
];

export function StyledNavLink({
    isActive,
    className,
    ...linkProps
}: LinkProps & {
    isActive: boolean;
    children: React.ReactNode;
    // eslint-disable-next-line react/require-default-props
    className?: string;
}) {
    return (
        <NavLink
            className={`${className ?? ""} ${
                isActive ? "text-turquoise-200" : "hover:text-turquoise-200"
            }`}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...linkProps}
        />
    );
}

export function NavBar() {
    const [isMenuShown, setIsMenuShown] = useState(false);
    const pathname = usePathname();
    const [linkRef, setLinkRef] = useState<LinkProps["href"]>(pathname!);
    return (
        <nav
            className={`${
                isMenuShown
                    ? "max-md:w-full max-md:opacity-100"
                    : "max-md:w-0 max-md:opacity-0"
            } max-md:animate-sideways-once right-0 top-0 z-40 overflow-hidden transition-all duration-500 ease-in-out max-md:absolute max-md:h-screen max-md:bg-white max-md:pt-24 md:block`}
        >
            <ul className="flex flex-col items-center justify-end gap-10 text-sm leading-[22px] md:flex-row md:gap-4 md:text-[15px] min-[900px]:gap-5 lg:gap-8">
                {navbarItems.map(({ ref, label, prefetch }) => (
                    <li key={ref} className="relative">
                        <StyledNavLink
                            isActive={ref === linkRef}
                            href={ref}
                            onClick={() => {
                                setLinkRef(ref);
                                setIsMenuShown(false);
                            }}
                            prefetch={prefetch}
                        >
                            {label}
                        </StyledNavLink>
                        <span className="absolute -bottom-5 left-[calc(50%_-_theme(space.24))] w-48 border-b-2 md:hidden" />
                    </li>
                ))}
                <li className="order-first justify-end md:order-last">
                    <div className="text-turquoise-200 flex flex-nowrap items-center justify-center gap-2">
                        {/* <Login
                                onActionClick={() => setIsMenuShown(false)}
                            /> */}
                    </div>
                </li>
            </ul>
        </nav>
    );
}
