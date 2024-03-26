import { getServerSession } from "next-auth";
import AccessDenied from "@/components/Shared/AccessDenied";
import { AdminNav } from "@/components/Shared/AdminNav";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import Balancer from "react-wrap-balancer";
import prisma from "@/lib/prisma";
import AppointmentEditDialog from "../../../components/Appointments/AppointmentEditDialog";
import AppointmentDelete from "../../../components/Appointments/AppointmentDelete";

export default async function Page() {
    const appointments = await prisma.appointment.findMany();

    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 p-5 shadow-md md:col-span-3">
                    <AdminNav />
                    <div className="mt-5 grid grid-cols-3">
                        <div className=""></div>
                        <h2 className="bg-clip-text text-center font-display text-xl font-bold md:text-3xl md:font-normal">
                            <Balancer>Appointments</Balancer>
                        </h2>
                    </div>
                    <div className="text-center">
                        <ul>
                            {appointments?.map((a) => (
                                <li className="mt-5" key={a.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <p>
                                            {a.service_name} - {a.staff_name}
                                        </p>
                                        <div className="flex items-stretch">
                                            <AppointmentEditDialog
                                                appointment={a}
                                            />
                                            <AppointmentDelete
                                                appointmentId={a.id}
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
