"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useServiceModal } from "./ServiceModal";

export default function ServiceDialog() {
    const { DemoModal, setShowDemoModal } = useServiceModal();
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
