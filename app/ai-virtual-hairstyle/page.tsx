import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import AiVirtualHairstyle from "@/components/AiVirtualHairstyle/AiVirtualHairstyle";
import Balancer from "react-wrap-balancer";

export default async function Page() {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (!session) return AccessDenied();

    return (
        <>
            <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                <h1
                    className="animate-fade-up bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
                    style={{
                        animationDelay: "0.15s",
                        animationFillMode: "forwards"
                    }}
                >
                    <p>
                        <Balancer>Ai Virtual Hairstyle</Balancer>
                    </p>
                </h1>
                <p
                    className="mt-6 animate-fade-up text-center opacity-0 md:text-xl"
                    style={{
                        animationDelay: "0.25s",
                        animationFillMode: "forwards"
                    }}
                >
                    <Balancer>
                        Step into the Future of Hair Design with Ai Virtual
                        Hairstyle - Where Innovation Meets Glamour!
                    </Balancer>
                </p>
            </div>
            <AiVirtualHairstyle />
        </>
    );
}
