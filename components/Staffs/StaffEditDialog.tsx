"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { useStaffEditModal } from "./StaffEditModal";

export default function StaffEditDialog({ staff }) {
    const { DemoModal, setShowDemoModal } = useStaffEditModal(staff);
    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Edit Staff">
                <Pencil1Icon />
            </button>
        </>
    );
}
