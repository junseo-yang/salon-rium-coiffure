"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useStaffModal } from "./StaffModal";

export default function StaffDialog() {
    const { DemoModal, setShowDemoModal } = useStaffModal();
    return (
        <div className="flex h-full items-center">
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Add Staff">
                <PlusCircledIcon />
            </button>
        </div>
    );
}
