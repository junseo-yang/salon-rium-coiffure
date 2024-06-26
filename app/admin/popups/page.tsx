import Balancer from "react-wrap-balancer";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";
import AccessDenied from "@/components/Shared/AccessDenied";
import { AdminNav } from "@/components/Shared/AdminNav";
import PopUpDialog from "@/components/PopUps/PopUpDialog";
import PopUpDelete from "@/components/PopUps/PopUpDelete";
import PopUpEditDialog from "@/components/PopUps/PopUpEditDialog";
import prisma from "@/lib/prisma";

export default async function Page() {
    const popUps = await prisma.popUp.findMany();

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
                            <Balancer>Pop-Ups</Balancer>
                        </h2>
                        <div>
                            <PopUpDialog />
                        </div>
                    </div>
                    <div className="text-center">
                        <ul>
                            {popUps?.map((popUp) => (
                                <li className="mt-5" key={popUp.id}>
                                    <div className="mt-5 grid grid-cols-3">
                                        <div></div>
                                        <p className="break-all">
                                            <strong>{popUp.title}</strong>{" "}
                                            <br />
                                            {popUp.description} <br />
                                            {new Date(
                                                popUp.startDate
                                            ).toLocaleString("en-US", {
                                                timeZone: "America/New_York",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })}{" "}
                                            -{" "}
                                            {popUp.endDate
                                                ? new Date(
                                                      popUp.endDate
                                                  ).toLocaleString("en-US", {
                                                      timeZone:
                                                          "America/New_York",
                                                      year: "numeric",
                                                      month: "short",
                                                      day: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                      hour12: true
                                                  })
                                                : "Ongoing"}
                                        </p>
                                        <div className="flex items-stretch">
                                            <PopUpEditDialog popUp={popUp} />
                                            <PopUpDelete popUpId={popUp.id} />
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
