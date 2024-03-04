import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import AdminCalendar from "@/components/Booking/AdminCalendar";
import prisma from "@/lib/prisma";

export default async function Page() {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    const appointments = await prisma.appointment.findMany();

    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md md:col-span-3">
                    <div>
                        <AdminCalendar appointments={appointments} />
                    </div>
                </div>
            </div>
        </>
    );
}
