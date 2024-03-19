"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useBreakModal } from "./BreakModal";

export default function BreakDialog({ staffs }) {
    const { DemoModal, setShowDemoModal } = useBreakModal(staffs);
    return (
        <div className="flex h-full items-center">
            <DemoModal />
            <button
                id="btnAddBreak"
                onClick={() => setShowDemoModal(true)}
                aria-label="Save"
            >
                <PlusCircledIcon />
            </button>
        </div>
    );
}
