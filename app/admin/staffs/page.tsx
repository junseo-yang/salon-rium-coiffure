import Balancer from "react-wrap-balancer";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import StaffDialog from "@/components/Staffs/StaffDialog";
import StaffDelete from "@/components/Staffs/StaffDelete";
import StaffEditDialog from "@/components/Staffs/StaffEditDialog";
import prisma from "@/lib/prisma";

export default async function Page() {
    const staffs = await prisma.staff.findMany();

    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md md:col-span-3">
                    <div className="mt-5 grid grid-cols-3">
                        <div className=""></div>
                        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Staff Members</Balancer>
                        </h2>
                        <div>
                            <StaffDialog />
                        </div>
                    </div>
                    <div className="text-center">
                        <ul>
                            {staffs?.map((member) => (
                                <li className="mt-5" key={member.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <p>
                                            {member.name} - {member.role} <br />{" "}
                                            {member.description}
                                        </p>
                                        <div className="flex items-stretch">
                                            <StaffEditDialog staff={member} />
                                            <StaffDelete staffId={member.id} />
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
