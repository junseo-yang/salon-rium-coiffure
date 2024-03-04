"use client";

import Popover from "@/components/Shared/Popover";
import { Service, Staff } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import CustomerCalendar from "./CustomerCalendar";

export default function Booking({ services }) {
    const [filteredDesigners, setFilteredDesigners] = useState<Staff[] | null>(
        null
    );

    const [openDesignerPopover, setOpenDesignerPopover] = useState(false);
    const [openServicePopover, setOpenServicePopover] = useState(false);

    const [selectedDesigner, setSelectedDesigner] = useState<Staff | null>(
        null
    );
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );

    const clickDesigner = (staff: any) => {
        setSelectedDesigner(staff);

        setOpenDesignerPopover(false);
    };

    const clickService = (service: any) => {
        setSelectedDesigner(null);
        setSelectedService(service);

        setFilteredDesigners(service.staffs);

        setOpenServicePopover(false);
    };

    return (
        <>
            <div className="m-5 flex">
                <div className="w-100 mr-1">
                    <Popover
                        content={
                            <div className="mr-3 w-full rounded-md bg-white p-2 sm:w-40">
                                {services?.map((s: Service) => (
                                    <button
                                        key={s.name}
                                        onClick={() => clickService(s)}
                                        className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                    >
                                        {s.name} - ${s.price}
                                    </button>
                                )) ?? "Select Service"}
                            </div>
                        }
                        openPopover={openServicePopover}
                        setOpenPopover={setOpenServicePopover}
                    >
                        <button
                            onClick={() =>
                                setOpenServicePopover(!openServicePopover)
                            }
                            className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                        >
                            <p className="text-gray-600">
                                {selectedService?.name ?? "Select Service"}
                            </p>
                            <ChevronDown
                                className={`h-4 w-4 text-gray-600 transition-all ${
                                    openServicePopover ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </Popover>
                </div>
                <div>
                    <Popover
                        content={
                            <div className="w-full rounded-md bg-white p-2 sm:w-40">
                                {filteredDesigners?.map((staff: Staff) => (
                                    <button
                                        key={staff.name}
                                        onClick={() => clickDesigner(staff)}
                                        className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                    >
                                        {staff.name}
                                    </button>
                                ))}
                            </div>
                        }
                        openPopover={openDesignerPopover}
                        setOpenPopover={setOpenDesignerPopover}
                    >
                        <button
                            onClick={() =>
                                setOpenDesignerPopover(!openDesignerPopover)
                            }
                            className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                        >
                            <p className="text-gray-600">
                                {selectedDesigner?.name ?? "Select Designer"}
                            </p>
                            <ChevronDown
                                className={`h-4 w-4 text-gray-600 transition-all ${
                                    openDesignerPopover ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </Popover>
                </div>
            </div>
            <div className="m-5">
                <CustomerCalendar
                    service={selectedService}
                    designer={selectedDesigner}
                ></CustomerCalendar>
            </div>
        </>
    );
}
