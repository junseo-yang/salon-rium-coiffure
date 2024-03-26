import Balancer from "react-wrap-balancer";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import ServiceDialog from "@/components/Services/ServiceDialog";
import prisma from "@/lib/prisma";
import { AdminNav } from "@/components/Shared/AdminNav";
import ServiceDelete from "../../../components/Services/ServiceDelete";
import ServiceEditDialog from "../../../components/Services/ServiceEditDialog";

export default async function Page() {
    const services = await prisma.service.findMany();

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
                            <Balancer>Services</Balancer>
                        </h2>
                        <div>
                            <ServiceDialog />
                        </div>
                    </div>
                    <div className="text-center">
                        <ul>
                            {services?.map((s) => (
                                <li className="mt-5" key={s.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <p>
                                            {s.name} - ${s.price}
                                        </p>
                                        <div className="flex items-stretch">
                                            <ServiceEditDialog service={s} />
                                            <ServiceDelete serviceId={s.id} />
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
