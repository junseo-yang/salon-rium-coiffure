"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useServiceEditModal } from "./ServiceEditModal";

export default function ServiceEditDialog({ service }) {
    const { DemoModal, setShowDemoModal } = useServiceEditModal(service);
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Save">
                <Pencil1Icon />
            </button>
        </>
    );
}
