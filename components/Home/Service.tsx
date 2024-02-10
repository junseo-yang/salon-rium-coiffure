import prisma from "@/lib/prisma";
import Balancer from "react-wrap-balancer";

export default async function Service() {
    const services = await prisma.service.findMany();

    return (
        <div
            className="my-10 w-full max-w-screen-xl animate-fade-up gap-5 px-5 opacity-0 xl:px-0"
            style={{
                animationDelay: "0.35s",
                animationFillMode: "forwards"
            }}
        >
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-md">
                <div className="mx-auto max-w-md p-6 text-center">
                    <h2 className="flex items-center justify-center bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                        <Balancer>Services</Balancer>
                    </h2>
                    {!services.length ? (
                        <div className="prose-sm mt-2 leading-normal text-gray-500 md:prose">
                            <Balancer>No service to display</Balancer>
                        </div>
                    ) : (
                        services.map((service) => (
                            <div
                                className="prose-sm mt-2 leading-normal text-gray-500 md:prose"
                                key={service.id}
                            >
                                <Balancer>
                                    {service.name} | {service.price}
                                </Balancer>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
