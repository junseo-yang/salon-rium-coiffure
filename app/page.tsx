import Balancer from "react-wrap-balancer";
import prisma from "@/lib/prisma";
import { ServiceCategory } from "@prisma/client";
import PopUpsClientComponent from "@/components/PopUps/PopUpsClientComponent";
import { getAvailableService } from "./admin/services/actions";

export default async function Home() {
    // "use server";

    const services = await getAvailableService();
    const staffs = await prisma.staff.findMany();
    const popUps = await prisma.popUp.findMany();

    const currentDate = new Date();

    // Filter pop-ups that should be currently displayed
    const activePopUps = popUps
        .filter((popUp) => {
            const startDate = new Date(popUp.startDate);
            const endDate = popUp.endDate ? new Date(popUp.endDate) : null;
            return (
                startDate <= currentDate && (!endDate || currentDate <= endDate)
            );
        })
        .map((popUp) => ({
            ...popUp,
            countdown: 5
        }));

    const menServices = services.filter(
        (s) => s.category === ServiceCategory.Men
    );
    const womenServices = services.filter(
        (s) => s.category === ServiceCategory.Women
    );
    const kidServices = services.filter(
        (s) => s.category === ServiceCategory.Kid
    );

    return (
        <>
            {/* Display active pop-ups */}
            <PopUpsClientComponent initialPopUps={activePopUps} />

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
                        // href={BOOKING_PAGE_URL}
                        // target="_blank"
                        href="/booking"
                        rel="noopener noreferrer"
                    >
                        <p>Book Now</p>
                    </a>
                </div>
            </div>

            <div
                className="my-10 w-full max-w-screen-xl animate-fade-up gap-5 px-5 opacity-0 xl:px-0"
                style={{
                    animationDelay: "0.35s",
                    animationFillMode: "forwards"
                }}
            >
                <div className="relative rounded-xl border border-gray-200 bg-white shadow-md">
                    <div className="mx-auto w-full p-6 text-center">
                        <h2 className="flex items-center justify-center bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Services</Balancer>
                        </h2>

                        {!services.length ? (
                            <div className="prose-sm mt-2 leading-normal text-gray-500">
                                <Balancer>No service to display</Balancer>
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-3">
                                <div>
                                    <h3>Men</h3>
                                    {menServices.map((service) => (
                                        <div
                                            className="prose-sm mt-2 leading-normal text-gray-500 md:prose"
                                            key={service.id}
                                        >
                                            <Balancer>
                                                {service.name} - $
                                                {service.price}
                                            </Balancer>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3>Women</h3>
                                    {womenServices.map((service) => (
                                        <div
                                            className="prose-sm mt-2 leading-normal text-gray-500 md:prose"
                                            key={service.id}
                                        >
                                            <Balancer>
                                                {service.name} - $
                                                {service.price}
                                            </Balancer>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3>Kid</h3>
                                    {kidServices.map((service) => (
                                        <div
                                            className="prose-sm mt-2 leading-normal text-gray-500 md:prose"
                                            key={service.id}
                                        >
                                            <Balancer>
                                                {service.name} - $
                                                {service.price}
                                            </Balancer>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Staff Profiles Section */}
            <div
                className="my-10 w-full max-w-screen-xl animate-fade-up gap-5 px-5 opacity-0 xl:px-0"
                style={{
                    animationDelay: "0.4s", // Adjust the delay as needed
                    animationFillMode: "forwards"
                }}
            >
                <div className="relative rounded-xl border border-gray-200 bg-white shadow-md">
                    <div className="mx-auto w-full p-6 text-center">
                        <h2 className="flex items-center justify-center bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Our Staff</Balancer>
                        </h2>
                        {!staffs.length ? (
                            <div className="prose-sm mt-2 leading-normal text-gray-500">
                                <Balancer>
                                    No staff profiles to display
                                </Balancer>
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {staffs.map((member) => (
                                    <div
                                        className="prose-sm mt-2 leading-normal text-gray-500 md:prose"
                                        key={member.id}
                                    >
                                        <Balancer>
                                            <div className="font-bold">
                                                {member.name}
                                            </div>
                                            <p>{member.description}</p>
                                            <p className="italic">
                                                {member.role}
                                            </p>
                                        </Balancer>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
