"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useAppointmentModal } from "./AppointmentModal";

export default function APpointmentDialog() {
    const { DemoModal, setShowDemoModal } = useAppointmentModal();
    return (
        <div className="flex h-full items-center">
            <DemoModal />
            <button
                id="btnAddService"
                onClick={() => setShowDemoModal(true)}
                aria-label="Save"
            >
                <PlusCircledIcon />
            </button>
        </div>
    );
}
