import Balancer from "react-wrap-balancer";
import Booking from "@/components/Booking/Booking";
import { getAvailableService } from "../admin/services/actions";

export default async function Page() {
    const queryOptions = {
        include: {
            staffs: true
        }
    };

    const services = await getAvailableService(queryOptions);

    return (
        <>
            <div className="w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
                <div className="relative col-span-1 flex-1 items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md md:col-span-3">
                    <div className="mt-5 grid grid-cols-3">
                        <div className=""></div>
                        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
                            <Balancer>Booking Services</Balancer>
                        </h2>
                    </div>

                    <div>
                        <Booking services={services}></Booking>
                    </div>
                </div>
            </div>
        </>
    );
}
