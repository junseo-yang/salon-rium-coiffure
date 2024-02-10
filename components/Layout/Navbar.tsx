"use client";

import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { Session } from "next-auth";
import { useSignInModal } from "./SignInModal";
import UserDropdown from "./UserDropdown";

export default function NavBar({ session }: { session: Session | null }) {
    const { SignInModal, setShowSignInModal } = useSignInModal();
    const scrolled = useScroll(50);

    return (
        <>
            <SignInModal />
            <div
                className={`fixed top-0 flex w-full justify-center ${
                    scrolled
                        ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                        : "bg-white/0"
                } z-30 transition-all`}
            >
                <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center font-display text-2xl"
                    >
                        <p>Salon Rium Coiffure</p>
                    </Link>
                    <div>
                        {session ? (
                            <UserDropdown session={session} />
                        ) : (
                            <button
                                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                                onClick={() => setShowSignInModal(true)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
