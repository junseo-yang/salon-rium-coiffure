import Balancer from "react-wrap-balancer";
import { BOOKING_PAGE_URL } from "@/lib/constants";
import Service from "@/components/Home/Service";

export default async function Home() {
    return (
        <>
            <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                <h1
                    className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
                    style={{
                        animationDelay: "0.15s",
                        animationFillMode: "forwards"
                    }}
                >
                    <p>
                        <Balancer>Welcome to Salon Rium Coiffure!</Balancer>
                    </p>
                </h1>
                <p
                    className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
                    style={{
                        animationDelay: "0.25s",
                        animationFillMode: "forwards"
                    }}
                >
                    <Balancer>
                        Unleash Your Beauty at Salon Rium Coiffure - Where Style
                        Meets Sophistication!
                    </Balancer>
                </p>
                <div
                    className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
                    style={{
                        animationDelay: "0.3s",
                        animationFillMode: "forwards"
                    }}
                >
                    <a
                        className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
                        href={BOOKING_PAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p>Book Now</p>
                    </a>
                </div>
            </div>

            <Service />
        </>
    );
}
