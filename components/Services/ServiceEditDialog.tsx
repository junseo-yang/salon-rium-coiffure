"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useServiceEditModal } from "./ServiceEditModal";

export default function ServiceEditDialog({ service, staffs }) {
    const { DemoModal, setShowDemoModal } = useServiceEditModal(
        service,
        staffs
    );
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Save">
                <Pencil1Icon />
            </button>
        </>
    );
}
