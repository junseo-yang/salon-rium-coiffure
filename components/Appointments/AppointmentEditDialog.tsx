"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useAppointmentEditModal } from "./AppointmentEditModal";

export default function AppointmentEditDialog({ appointment }) {
    const { DemoModal, setShowDemoModal } =
        useAppointmentEditModal(appointment);
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Save">
                <Pencil1Icon />
            </button>
        </>
    );
}
