/* eslint-disable no-alert */

"use client";

import { Service, Staff } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import useWindowSize from "@/lib/hooks/use-window-size";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import BookingPopover from "./BookingPopover";
import CustomerCalendar from "./CustomerCalendar";

import "./styles.css";

export default function Booking({ services }) {
    const { isDesktop } = useWindowSize();

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
                    <BookingPopover
                        content={
                            <ScrollArea.Root className="ScrollAreaRoot">
                                <ScrollArea.Viewport className="ScrollAreaViewport">
                                    <div
                                        id="listOfServices"
                                        className="mr-3 w-full rounded-md p-2 sm:w-40"
                                    >
                                        {services
                                            ?.map((s: Service) => (
                                                <button
                                                    key={s.name}
                                                    onClick={() =>
                                                        clickService(s)
                                                    }
                                                    className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                                >
                                                    {s.name} - ${s.price}
                                                </button>
                                            ))
                                            .reverse() ?? "Select Service"}
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                    className="ScrollAreaScrollbar"
                                    orientation="vertical"
                                >
                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Scrollbar
                                    className="ScrollAreaScrollbar"
                                    orientation="horizontal"
                                >
                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner className="ScrollAreaCorner" />
                            </ScrollArea.Root>
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
                            <p>{selectedService?.name ?? "Select Service"}</p>
                            <ChevronDown
                                className={`h-4 w-4 transition-all ${
                                    openServicePopover ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </BookingPopover>
                </div>
                <div>
                    <BookingPopover
                        content={
                            <ScrollArea.Root className="ScrollAreaRoot h-1/3">
                                <ScrollArea.Viewport className="ScrollAreaViewport">
                                    <div className="w-full rounded-md p-2 sm:w-40">
                                        {filteredDesigners ? (
                                            filteredDesigners?.map(
                                                (staff: Staff) => (
                                                    <button
                                                        key={staff.name}
                                                        onClick={() =>
                                                            clickDesigner(staff)
                                                        }
                                                        className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                                    >
                                                        {staff.name}
                                                    </button>
                                                )
                                            )
                                        ) : (
                                            <button className="pointer-events-none flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm">
                                                Please select service first
                                            </button>
                                        )}
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                    className="ScrollAreaScrollbar"
                                    orientation="vertical"
                                >
                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Scrollbar
                                    className="ScrollAreaScrollbar"
                                    orientation="horizontal"
                                >
                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner className="ScrollAreaCorner" />
                            </ScrollArea.Root>
                        }
                        openPopover={openDesignerPopover}
                        setOpenPopover={setOpenDesignerPopover}
                    >
                        <button
                            onClick={() => {
                                setOpenDesignerPopover(!openDesignerPopover);
                            }}
                            className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                        >
                            <p>{selectedDesigner?.name ?? "Select Designer"}</p>
                            <ChevronDown
                                className={`h-4 w-4 transition-all ${
                                    openDesignerPopover ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </BookingPopover>
                </div>
            </div>
            <div className={isDesktop ? "mb-5" : ""}>
                <CustomerCalendar
                    service={selectedService}
                    designer={selectedDesigner}
                ></CustomerCalendar>
            </div>
        </>
    );
}
