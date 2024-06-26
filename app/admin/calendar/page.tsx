import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import AdminCalendar from "@/components/Booking/AdminCalendar";
import { AdminNav } from "@/components/Shared/AdminNav";
import prisma from "@/lib/prisma";

export default async function Page() {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    const appointments = await prisma.appointment.findMany();

    const breaks = await prisma.break.findMany({
        include: {
            staff: true
        }
    });

    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 p-5 shadow-md md:col-span-3">
                    <AdminNav />
                    <br />
                    <div>
                        <AdminCalendar
                            appointments={appointments}
                            breaks={breaks}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
