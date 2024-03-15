"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useBlockingEditModal } from "./BlockingEditModal";

export default function BlockingEditModal({ blocking }) {
    const { DemoModal, setShowDemoModal } = useBlockingEditModal(blocking);
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Save">
                <Pencil1Icon />
            </button>
        </>
    );
}
