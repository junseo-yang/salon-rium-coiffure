"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useBreakEditModal } from "./BreakEditModal";

export default function BreakEditModal({ aBreak, staffs }) {
    const { DemoModal, setShowDemoModal } = useBreakEditModal(aBreak, staffs);
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Save">
                <Pencil1Icon />
            </button>
        </>
    );
}
