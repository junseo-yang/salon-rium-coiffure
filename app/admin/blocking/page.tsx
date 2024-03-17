import Balancer from "react-wrap-balancer";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import BlockingDialog from "@/components/Blocking/BlockingDialog";
import prisma from "@/lib/prisma";
import moment from "moment";
import BlockingEditModal from "@/components/Blocking/BlockingEditDialog";
import BlockingDelete from "@/components/Blocking/BlockingDelete";

export default async function Page() {
    const blockings = await prisma.blocking.findMany({
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
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md md:col-span-3">
                    <div className="mt-5 grid grid-cols-3">
                        <div className=""></div>
                        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Blocking</Balancer>
                        </h2>
                        <div>
                            <BlockingDialog staffs={staffs} />
                        </div>
                    </div>
                    <div className="text-center">
                        <ul>
                            {blockings?.map((b) => (
                                <li className="mt-5" key={b.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <div>
                                            <p>
                                                {b.staff.name} - {b.name}:{" "}
                                            </p>
                                            <p>
                                                {moment(b.from_datetime)
                                                    .local()
                                                    .format(
                                                        "yyyy-MM-DD hh:mm"
                                                    )}{" "}
                                                ~{" "}
                                                {moment(b.to_datetime)
                                                    .local()
                                                    .format("yyyy-MM-DD hh:mm")}
                                            </p>
                                        </div>

                                        <div className="flex items-stretch">
                                            <BlockingEditModal
                                                blocking={b}
                                                staffs={staffs}
                                            />
                                            <BlockingDelete blockingId={b.id} />
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
