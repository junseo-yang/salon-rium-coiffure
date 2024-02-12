import { getServerSession } from "next-auth";
import Balancer from "react-wrap-balancer";
import AccessDenied from "@/components/Shared/AccessDenied";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Page() {
    const session = await getServerSession(authOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    return (
        <>
            <h1
                className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
                style={{
                    animationDelay: "0.15s",
                    animationFillMode: "forwards"
                }}
            >
                <p>
                    <Balancer>Admin page</Balancer>
                </p>
            </h1>
            <br />
            <a
                className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl md:leading-[5rem]"
                style={{
                    animationDelay: "0.15s",
                    animationFillMode: "forwards",
                    cursor: "pointer"
                }}
                href="/admin/services"
            >
                <p>
                    <Balancer>Go to Service Management</Balancer>
                </p>
            </a>
            <a
                className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl md:leading-[5rem]"
                style={{
                    animationDelay: "0.15s",
                    animationFillMode: "forwards",
                    cursor: "pointer"
                }}
                href="/admin/teams"
            >
                <p>
                    <Balancer>Go to Team Management</Balancer>
                </p>
            </a>
        </>
    );
}
