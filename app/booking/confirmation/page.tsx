import Balancer from "react-wrap-balancer";
import prisma from "@/lib/prisma";

export default async function Page({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const id = searchParams.appointment_id;

    const appointment = await prisma.appointment.findUnique({
        where: {
            id: id?.toString()
        }
    });
    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md md:col-span-3">
                    <div className="mt-5 grid grid-cols-3">
                        <div className=""></div>
                        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Booking Confirmation</Balancer>
                        </h2>
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                        <div>
                            <div className="flex flex-col items-center space-y-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-28 w-28 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h1 className="text-4xl font-bold">
                                    Thank You !
                                </h1>
                                <p>Your appointment has been made!</p>
                                <p>Service name: {appointment?.service_name}</p>
                                <p>Designer name: {appointment?.staff_name}</p>
                                <p>
                                    Date:{" "}
                                    {new Date(
                                        appointment?.from_date!
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    Time:{" "}
                                    {new Date(appointment?.from_date!)
                                        .toLocaleTimeString()
                                        .replace(":00 ", "")}{" "}
                                    to{" "}
                                    {new Date(appointment?.to_date!)
                                        .toLocaleTimeString()
                                        .replace(":00 ", "")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <ConfirmationBox id={id}></ConfirmationBox> */}
                </div>
            </div>
        </>
    );
}
