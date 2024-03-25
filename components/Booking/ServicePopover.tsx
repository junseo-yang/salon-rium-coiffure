"use client";

import Popover from "@/components/Shared/Popover";
import { Service } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ServicePopover({ services }) {
    const [openPopover, setOpenPopover] = useState(false);

    const [clickedServiceName, setClickedServiceName] =
        useState("Not selected");

    const clickService = (s: Service) => {
        setClickedServiceName(s.name);

        setOpenPopover(false);
    };

    return (
        <>
            <Popover
                content={
                    <div className="w-full rounded-md p-2 sm:w-40">
                        {services.map((s: Service) => (
                            <button
                                key={s.name}
                                onClick={() => clickService(s)}
                                className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                            >
                                {s.name} - ${s.price}
                            </button>
                        ))}
                    </div>
                }
                openPopover={openPopover}
                setOpenPopover={setOpenPopover}
            >
                <button
                    onClick={() => setOpenPopover(!openPopover)}
                    className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                >
                    <p>{clickedServiceName}</p>
                    <ChevronDown
                        className={`h-4 w-4 transition-all ${
                            openPopover ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </Popover>
        </>
    );
}
