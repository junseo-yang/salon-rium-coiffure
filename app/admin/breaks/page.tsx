import Balancer from "react-wrap-balancer";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import BreakDialog from "@/components/Breaks/BreakDialog";
import prisma from "@/lib/prisma";
import moment from "moment-timezone";

import BreakEditModal from "@/components/Breaks/BreakEditDialog";
import BreakDelete from "@/components/Breaks/BreakDelete";
import { AdminNav } from "@/components/Shared/AdminNav";

export default async function Page() {
    const breaks = await prisma.break.findMany({
        include: {
            staff: true
        }
    });

    const staffs = await prisma.staff.findMany();

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
                            <Balancer>Break</Balancer>
                        </h2>
                        <div>
                            <BreakDialog staffs={staffs} />
                        </div>
                    </div>
                    <div className="text-center">
                        <ul>
                            {breaks?.map((b) => (
                                <li className="mt-5" key={b.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <div>
                                            <p>
                                                {b.staff.name} - {b.name}:{" "}
                                            </p>
                                            <p>
                                                {moment(b.from_datetime)
                                                    .tz("America/Montreal")
                                                    .format(
                                                        "yyyy-MM-DD HH:mm"
                                                    )}{" "}
                                                ~{" "}
                                                {moment(b.to_datetime)
                                                    .tz("America/Montreal")
                                                    .format("yyyy-MM-DD HH:mm")}
                                            </p>
                                        </div>

                                        <div className="flex items-stretch">
                                            <BreakEditModal
                                                aBreak={b}
                                                staffs={staffs}
                                            />
                                            <BreakDelete breakId={b.id} />
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
